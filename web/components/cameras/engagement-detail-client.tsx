"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LessonDetailClient } from "@/components/cameras/lesson-detail-client";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { LessonLiveArchiveClient } from "@/components/cameras/lesson-live-archive-client";
import { LiveCameraDetailClient } from "@/components/cameras/live-camera-detail-client";
import {
  findCameraByDeviceId,
  resolveEngagementDetailKind,
} from "@/lib/cameras/resolve-engagement-id";
import type { LessonRow } from "@/lib/lessons-types";

type EngagementDetailClientProps = {
  id: string;
};

export function EngagementDetailClient({ id }: EngagementDetailClientProps) {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get("sessionId");
  const kind = resolveEngagementDetailKind(id);
  const liveCamera = kind === "live" ? findCameraByDeviceId(id) : undefined;
  const [lessonRow, setLessonRow] = useState<LessonRow | null | undefined>(
    kind === "lesson" ? undefined : null,
  );

  useEffect(() => {
    if (kind !== "lesson") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (!res.ok) {
          if (!cancelled) setLessonRow(null);
          return;
        }
        const data = (await res.json()) as LessonRow;
        if (!cancelled) setLessonRow(data);
      } catch {
        if (!cancelled) setLessonRow(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, kind]);

  if (kind === "live" && liveCamera) {
    return (
      <LiveCameraDetailClient camera={liveCamera} initialSessionId={initialSessionId} />
    );
  }

  if (kind === "lesson") {
    if (lessonRow === undefined) {
      return <AdmLoadingScreen variant="inline" />;
    }
    if (lessonRow && lessonRow.source_live_session_id && lessonRow.source_live_device_id) {
      return <LessonLiveArchiveClient lessonId={id} />;
    }
    if (lessonRow) {
      return <LessonDetailClient lessonId={id} />;
    }
  }

  return (
    <p className="text-muted-foreground text-sm">
      Запись не найдена. Проверьте ссылку или вернитесь в{" "}
      <Link href="/dashboard/cameras/engagement" className="text-primary hover:underline">
        Вовлечённость классов
      </Link>
      .
    </p>
  );
}
