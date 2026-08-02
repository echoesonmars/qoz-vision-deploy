import { spawn } from "node:child_process";
import { getDb } from "../services/db.js";
import {
  buildRtspUrl,
  toCameraRecord,
  type CameraInput,
  type CameraRow,
  type CameraVendor,
  type StreamProfile,
} from "../services/camera-rtsp.js";
import {
  deleteMediaMtxPath,
  upsertMediaMtxPath,
} from "../services/mediamtx-sync.js";
import type { FastifyInstance } from "fastify";

type CameraBody = {
  name?: string;
  organizationName?: string;
  vendor?: CameraVendor;
  nvrAddress?: string;
  nvrPort?: number;
  username?: string;
  password?: string;
  channel?: number;
  streamProfile?: StreamProfile;
  transcodeToH264?: boolean;
  rtspUrlOverride?: string | null;
  deviceType?: string;
  serialNo?: string;
  equipmentId?: string;
  isEnabled?: boolean;
  sortIndex?: number;
};

function parseInput(body: CameraBody, partial = false): CameraInput | { error: string } {
  if (!partial) {
    if (!body.name?.trim()) return { error: "name is required" };
    if (!body.vendor) return { error: "vendor is required" };
    if (!body.nvrAddress?.trim() && body.vendor !== "custom") {
      return { error: "nvrAddress is required" };
    }
    if (!body.username?.trim() && body.vendor !== "custom") {
      return { error: "username is required" };
    }
    if (!body.password?.trim() && body.vendor !== "custom") {
      return { error: "password is required" };
    }
    if (!body.channel || body.channel < 1) return { error: "channel is required" };
    if (!body.equipmentId?.trim()) return { error: "equipmentId is required" };
    if (body.vendor === "custom" && !body.rtspUrlOverride?.trim()) {
      return { error: "rtspUrlOverride is required for custom vendor" };
    }
  }
  return {
    name: body.name?.trim() ?? "",
    organizationName: body.organizationName?.trim() ?? "",
    vendor: body.vendor ?? "dahua",
    nvrAddress: body.nvrAddress?.trim() ?? "",
    nvrPort: body.nvrPort ?? 554,
    username: body.username?.trim() ?? "",
    password: body.password ?? "",
    channel: body.channel ?? 1,
    streamProfile: body.streamProfile ?? "main",
    transcodeToH264: body.transcodeToH264 ?? false,
    rtspUrlOverride: body.rtspUrlOverride ?? null,
    deviceType: body.deviceType?.trim() || (body.vendor === "hikvision" ? "DS-N316(D)" : "XVR"),
    serialNo: body.serialNo?.trim() ?? "",
    equipmentId: body.equipmentId?.trim() ?? "",
    isEnabled: body.isEnabled ?? true,
    sortIndex: body.sortIndex ?? body.channel ?? 0,
  };
}

async function getCameraById(id: string): Promise<CameraRow | null> {
  const sql = getDb();
  const rows = await sql<CameraRow[]>`
    select * from public.cameras where id = ${id}::uuid limit 1
  `;
  return rows[0] ?? null;
}

function probeRtsp(rtspUrl: string): Promise<{ ok: boolean; output: string }> {
  const ffprobe = process.env.FFPROBE_PATH?.trim() || "ffprobe";
  return new Promise((resolve) => {
    const child = spawn(
      ffprobe,
      ["-rtsp_transport", "tcp", "-timeout", "10000000", "-i", rtspUrl],
      { windowsHide: true },
    );
    let output = "";
    const onData = (chunk: Buffer) => {
      output += chunk.toString("utf8");
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve({ ok: false, output: output || "ffprobe timeout" });
    }, 20_000);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0 || /Video:/.test(output), output });
    });
  });
}

export async function camerasCrudRoutes(app: FastifyInstance) {
  app.get("/api/cameras", async () => {
    const sql = getDb();
    const rows = await sql<CameraRow[]>`
      select * from public.cameras
      order by sort_index asc, channel asc
    `;
    return { cameras: rows.map(toCameraRecord), raw: rows };
  });

  app.post<{ Body: CameraBody }>("/api/cameras", async (req, reply) => {
    const parsed = parseInput(req.body ?? {});
    if ("error" in parsed) {
      return reply.code(400).send({ error: parsed.error });
    }
    const sql = getDb();
    const rows = await sql<CameraRow[]>`
      insert into public.cameras (
        name, organization_name, vendor, nvr_address, nvr_port,
        username, password, channel, stream_profile, transcode_to_h264,
        rtsp_url_override, device_type, serial_no, equipment_id,
        is_enabled, sort_index
      ) values (
        ${parsed.name}, ${parsed.organizationName ?? ""}, ${parsed.vendor},
        ${parsed.nvrAddress}, ${parsed.nvrPort ?? 554},
        ${parsed.username}, ${parsed.password}, ${parsed.channel},
        ${parsed.streamProfile ?? "main"}, ${parsed.transcodeToH264 ?? false},
        ${parsed.rtspUrlOverride ?? null}, ${parsed.deviceType ?? "XVR"},
        ${parsed.serialNo ?? ""}, ${parsed.equipmentId},
        ${parsed.isEnabled ?? true}, ${parsed.sortIndex ?? parsed.channel}
      )
      returning *
    `;
    const camera = rows[0];
    if (!camera) {
      return reply.code(500).send({ error: "insert failed" });
    }
    if (camera.is_enabled) {
      try {
        await upsertMediaMtxPath(camera);
      } catch (err) {
        app.log.warn({ err }, "MediaMTX sync after create failed");
      }
    }
    return { camera: toCameraRecord(camera) };
  });

  app.patch<{ Params: { id: string }; Body: CameraBody }>("/api/cameras/:id", async (req, reply) => {
    const existing = await getCameraById(req.params.id);
    if (!existing) {
      return reply.code(404).send({ error: "not found" });
    }
    const body = req.body ?? {};
    const nextVendor = body.vendor ?? existing.vendor;
    const next: CameraRow = {
      ...existing,
      name: body.name?.trim() ?? existing.name,
      organization_name: body.organizationName?.trim() ?? existing.organization_name,
      vendor: nextVendor,
      nvr_address: body.nvrAddress?.trim() ?? existing.nvr_address,
      nvr_port: body.nvrPort ?? existing.nvr_port,
      username: body.username?.trim() ?? existing.username,
      password: body.password ?? existing.password,
      channel: body.channel ?? existing.channel,
      stream_profile: body.streamProfile ?? existing.stream_profile,
      transcode_to_h264: body.transcodeToH264 ?? existing.transcode_to_h264,
      rtsp_url_override:
        body.rtspUrlOverride === undefined
          ? existing.rtsp_url_override
          : body.rtspUrlOverride,
      device_type: body.deviceType?.trim() ?? existing.device_type,
      serial_no: body.serialNo?.trim() ?? existing.serial_no,
      equipment_id: body.equipmentId?.trim() ?? existing.equipment_id,
      is_enabled: body.isEnabled ?? existing.is_enabled,
      sort_index: body.sortIndex ?? existing.sort_index,
      updated_at: new Date().toISOString(),
    };

    const sql = getDb();
    const rows = await sql<CameraRow[]>`
      update public.cameras set
        name = ${next.name},
        organization_name = ${next.organization_name},
        vendor = ${next.vendor},
        nvr_address = ${next.nvr_address},
        nvr_port = ${next.nvr_port},
        username = ${next.username},
        password = ${next.password},
        channel = ${next.channel},
        stream_profile = ${next.stream_profile},
        transcode_to_h264 = ${next.transcode_to_h264},
        rtsp_url_override = ${next.rtsp_url_override},
        device_type = ${next.device_type},
        serial_no = ${next.serial_no},
        equipment_id = ${next.equipment_id},
        is_enabled = ${next.is_enabled},
        sort_index = ${next.sort_index},
        updated_at = now()
      where id = ${existing.id}::uuid
      returning *
    `;
    const camera = rows[0];
    if (!camera) {
      return reply.code(500).send({ error: "update failed" });
    }

    const pathChanged =
      existing.equipment_id !== camera.equipment_id || existing.channel !== camera.channel;
    if (pathChanged) {
      try {
        await deleteMediaMtxPath(existing.equipment_id, existing.channel);
      } catch (err) {
        app.log.warn({ err }, "MediaMTX delete old path failed");
      }
    }
    try {
      if (camera.is_enabled) {
        await upsertMediaMtxPath(camera);
      } else {
        await deleteMediaMtxPath(camera.equipment_id, camera.channel);
      }
    } catch (err) {
      app.log.warn({ err }, "MediaMTX sync after update failed");
    }
    return { camera: toCameraRecord(camera) };
  });

  app.delete<{ Params: { id: string } }>("/api/cameras/:id", async (req, reply) => {
    const existing = await getCameraById(req.params.id);
    if (!existing) {
      return reply.code(404).send({ error: "not found" });
    }
    const sql = getDb();
    await sql`delete from public.cameras where id = ${existing.id}::uuid`;
    try {
      await deleteMediaMtxPath(existing.equipment_id, existing.channel);
    } catch (err) {
      app.log.warn({ err }, "MediaMTX delete after remove failed");
    }
    return { ok: true };
  });

  app.post<{ Params: { id: string } }>("/api/cameras/:id/probe", async (req, reply) => {
    const camera = await getCameraById(req.params.id);
    if (!camera) {
      return reply.code(404).send({ error: "not found" });
    }
    let rtspUrl: string;
    try {
      rtspUrl = buildRtspUrl(camera);
    } catch (err) {
      return reply.code(400).send({
        error: err instanceof Error ? err.message : String(err),
      });
    }
    const result = await probeRtsp(rtspUrl);
    const videoLine = result.output
      .split("\n")
      .find((line) => /Stream #.*Video:/.test(line));
    return {
      ok: result.ok,
      video: videoLine?.trim() ?? null,
      output: result.output.slice(-4000),
    };
  });
}
