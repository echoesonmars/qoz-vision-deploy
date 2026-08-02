import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getCameraDisplayLabel } from "@/lib/cameras/cameras-registry";
import { findCameraByDeviceId } from "@/lib/cameras/resolve-engagement-id";
import type { LessonRow } from "@/lib/lessons-types";

export function buildLiveArchiveTitle(deviceId: string, at: Date): string {
  const camera = findCameraByDeviceId(deviceId);
  const label = camera ? getCameraDisplayLabel(camera) : deviceId;
  return `Live · ${label} · ${format(at, "dd.MM.yyyy HH:mm", { locale: ru })}`;
}

export function formatLessonDisplayTitle(lesson: LessonRow): string {
  const stored = lesson.title?.trim();
  if (stored && !stored.toLowerCase().includes("gemini")) {
    return stored;
  }
  if (lesson.source_live_session_id && lesson.source_live_device_id) {
    return buildLiveArchiveTitle(
      lesson.source_live_device_id,
      new Date(lesson.created_at),
    );
  }
  if (stored) return stored;
  return `Урок от ${format(new Date(lesson.created_at), "dd.MM.yyyy HH:mm", { locale: ru })}`;
}
