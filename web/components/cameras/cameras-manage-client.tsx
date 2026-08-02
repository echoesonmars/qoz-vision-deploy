"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCameras } from "@/lib/cameras/cameras-context";
import { getPublicBackendBase } from "@/lib/cameras/cameras-registry";
import type { CameraRecord } from "@/lib/cameras/cameras-types";

type Vendor = "dahua" | "hikvision" | "custom";
type StreamProfile = "main" | "sub";

type CameraFormState = {
  name: string;
  organizationName: string;
  vendor: Vendor;
  nvrAddress: string;
  nvrPort: string;
  username: string;
  password: string;
  channel: string;
  streamProfile: StreamProfile;
  transcodeToH264: boolean;
  rtspUrlOverride: string;
  equipmentId: string;
  deviceType: string;
  isEnabled: boolean;
};

type ManagedCamera = CameraRecord & {
  vendor?: Vendor;
  nvrPort?: number;
  username?: string;
  streamProfile?: StreamProfile;
  transcodeToH264?: boolean;
  rtspUrlOverride?: string | null;
};

const emptyForm = (): CameraFormState => ({
  name: "",
  organizationName: "",
  vendor: "dahua",
  nvrAddress: "",
  nvrPort: "554",
  username: "kap1c",
  password: "Qereq11@",
  channel: "1",
  streamProfile: "main",
  transcodeToH264: false,
  rtspUrlOverride: "",
  equipmentId: "site-nvr",
  deviceType: "XVR",
  isEnabled: true,
});

function formFromCamera(camera: ManagedCamera): CameraFormState {
  return {
    name: camera.name,
    organizationName: camera.organizationName,
    vendor: camera.vendor ?? "dahua",
    nvrAddress: camera.address,
    nvrPort: String(camera.nvrPort ?? 554),
    username: camera.username ?? "kap1c",
    password: "",
    channel: String(camera.uniqueChannel),
    streamProfile: camera.streamProfile ?? "main",
    transcodeToH264: camera.transcodeToH264 ?? false,
    rtspUrlOverride: camera.rtspUrlOverride ?? "",
    equipmentId: camera.equipmentId,
    deviceType: camera.deviceType,
    isEnabled: camera.isEnabled,
  };
}

export function CamerasManageClient() {
  const { cameras, loading, error, refresh } = useCameras();
  const managed = cameras as ManagedCamera[];
  const [form, setForm] = useState<CameraFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [probeOut, setProbeOut] = useState<string | null>(null);

  const title = useMemo(
    () => (editingId ? "Редактировать камеру" : "Добавить камеру"),
    [editingId],
  );

  const setField = <K extends keyof CameraFormState>(key: K, value: CameraFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm());
    setProbeOut(null);
    setMessage(null);
  };

  const payload = () => ({
    name: form.name.trim(),
    organizationName: form.organizationName.trim(),
    vendor: form.vendor,
    nvrAddress: form.nvrAddress.trim(),
    nvrPort: Number(form.nvrPort) || 554,
    username: form.username.trim(),
    password: form.password,
    channel: Number(form.channel) || 1,
    streamProfile: form.streamProfile,
    transcodeToH264: form.transcodeToH264,
    rtspUrlOverride: form.rtspUrlOverride.trim() || null,
    equipmentId: form.equipmentId.trim(),
    deviceType:
      form.deviceType.trim() ||
      (form.vendor === "hikvision" ? "DS-N316(D)" : "XVR"),
    isEnabled: form.isEnabled,
    sortIndex: Number(form.channel) || 1,
  });

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const body = payload();
      if (editingId && !body.password) {
        delete (body as { password?: string }).password;
      }
      const base = getPublicBackendBase();
      const res = await fetch(
        editingId ? `${base}/api/cameras/${editingId}` : `${base}/api/cameras`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMessage(editingId ? "Камера обновлена" : "Камера добавлена");
      reset();
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Удалить камеру?")) return;
    setBusy(true);
    try {
      const base = getPublicBackendBase();
      const res = await fetch(`${base}/api/cameras/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      if (editingId === id) reset();
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка удаления");
    } finally {
      setBusy(false);
    }
  };

  const toggleEnabled = async (camera: ManagedCamera) => {
    setBusy(true);
    try {
      const base = getPublicBackendBase();
      const res = await fetch(`${base}/api/cameras/${camera.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !camera.isEnabled }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка переключения");
    } finally {
      setBusy(false);
    }
  };

  const probe = async (id: string) => {
    setBusy(true);
    setProbeOut(null);
    try {
      const base = getPublicBackendBase();
      const res = await fetch(`${base}/api/cameras/${id}/probe`, { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        video?: string | null;
        error?: string;
        output?: string;
      };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setProbeOut(data.video ?? data.output ?? (data.ok ? "OK" : "Нет видео"));
    } catch (e) {
      setProbeOut(e instanceof Error ? e.message : "Probe failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4 border-b border-border pb-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">
            Камеры хранятся в локальном Postgres и синхронизируются с MediaMTX без пересборки.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Название">
            <Input value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </Field>
          <Field label="Организация">
            <Input
              value={form.organizationName}
              onChange={(e) => setField("organizationName", e.target.value)}
            />
          </Field>
          <Field label="Equipment ID">
            <Input
              value={form.equipmentId}
              onChange={(e) => setField("equipmentId", e.target.value)}
            />
          </Field>
          <Field label="Vendor">
            <select
              className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
              value={form.vendor}
              onChange={(e) => {
                const vendor = e.target.value as Vendor;
                setField("vendor", vendor);
                if (vendor === "hikvision") setField("deviceType", "DS-N316(D)");
                if (vendor === "dahua") setField("deviceType", "XVR");
              }}
            >
              <option value="dahua">Dahua</option>
              <option value="hikvision">Hikvision</option>
              <option value="custom">Custom RTSP</option>
            </select>
          </Field>
          <Field label="NVR IP">
            <Input
              value={form.nvrAddress}
              onChange={(e) => setField("nvrAddress", e.target.value)}
              disabled={form.vendor === "custom"}
            />
          </Field>
          <Field label="Порт">
            <Input
              value={form.nvrPort}
              onChange={(e) => setField("nvrPort", e.target.value)}
              disabled={form.vendor === "custom"}
            />
          </Field>
          <Field label="Логин">
            <Input
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              disabled={form.vendor === "custom"}
            />
          </Field>
          <Field label={editingId ? "Пароль (оставьте пустым чтобы не менять)" : "Пароль"}>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              disabled={form.vendor === "custom"}
            />
          </Field>
          <Field label="Канал">
            <Input
              value={form.channel}
              onChange={(e) => setField("channel", e.target.value)}
            />
          </Field>
          <Field label="Профиль">
            <select
              className="border-input bg-background h-8 w-full rounded-lg border px-2 text-sm"
              value={form.streamProfile}
              onChange={(e) => setField("streamProfile", e.target.value as StreamProfile)}
            >
              <option value="main">main</option>
              <option value="sub">sub</option>
            </select>
          </Field>
          <Field label="Device type">
            <Input
              value={form.deviceType}
              onChange={(e) => setField("deviceType", e.target.value)}
            />
          </Field>
          <Field label="Custom RTSP">
            <Input
              value={form.rtspUrlOverride}
              onChange={(e) => setField("rtspUrlOverride", e.target.value)}
              placeholder="rtsp://..."
              disabled={form.vendor !== "custom"}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.transcodeToH264}
              onChange={(e) => setField("transcodeToH264", e.target.checked)}
            />
            Transcode H.265 → H.264
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(e) => setField("isEnabled", e.target.checked)}
            />
            Включена
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={busy} onClick={() => void save()}>
            {editingId ? "Сохранить" : "Добавить"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" disabled={busy} onClick={reset}>
              Отмена
            </Button>
          ) : null}
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        {probeOut ? (
          <pre className="bg-muted max-h-40 overflow-auto rounded-lg p-3 text-xs whitespace-pre-wrap">
            {probeOut}
          </pre>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Камеры ({managed.length})
          </h2>
          <Button type="button" variant="outline" disabled={busy || loading} onClick={() => void refresh()}>
            Обновить
          </Button>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Канал</TableHead>
                <TableHead>NVR</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managed.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell className="font-medium">{camera.name}</TableCell>
                  <TableCell>{camera.uniqueChannel}</TableCell>
                  <TableCell className="font-mono text-xs">{camera.address}</TableCell>
                  <TableCell>{camera.vendor ?? "—"}</TableCell>
                  <TableCell>{camera.isEnabled ? "on" : "off"}</TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      disabled={busy}
                      onClick={() => {
                        setEditingId(camera.id);
                        setForm(formFromCamera(camera));
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void toggleEnabled(camera)}
                    >
                      {camera.isEnabled ? "Off" : "On"}
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void probe(camera.id)}
                    >
                      Probe
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="destructive"
                      disabled={busy}
                      onClick={() => void remove(camera.id)}
                    >
                      Del
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
