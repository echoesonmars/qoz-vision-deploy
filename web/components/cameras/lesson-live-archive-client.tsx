"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LiveMonitorPanel } from "@/components/cameras/live-monitor-panel";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { Button } from "@/components/ui/button";
import { findCameraByDeviceId } from "@/lib/cameras/resolve-engagement-id";
import { formatLessonDisplayTitle } from "@/lib/live-archive-title";
import type { LessonRow } from "@/lib/lessons-types";
import { MdArrowBack } from "react-icons/md";

type LessonLiveArchiveClientProps = {
  lessonId: string;
};

export function LessonLiveArchiveClient({ lessonId }: LessonLiveArchiveClientProps) {
  const [lesson, setLesson] = useState<LessonRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/lessons/${lessonId}`);
    const data = (await res.json()) as LessonRow & { error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? res.statusText);
    }
    if (!data.source_live_session_id || !data.source_live_device_id) {
      throw new Error("Нет привязки к live-сессии");
    }
    setLesson(data);
    setError(null);
  }, [lessonId]);

  useEffect(() => {
    void load().catch((e) => {
      setError(e instanceof Error ? e.message : "Не удалось загрузить архив");
    });
  }, [load]);

  if (error) {
    return (
      <p className="text-destructive text-sm">
        {error}{" "}
        <Link href="/dashboard/cameras/engagement?tab=lessons" className="underline">
          К архиву
        </Link>
      </p>
    );
  }

  if (!lesson) {
    return <AdmLoadingScreen variant="inline" message="Загрузка live-архива…" />;
  }

  const camera = findCameraByDeviceId(lesson.source_live_device_id!);
  if (!camera) {
    return (
      <p className="text-muted-foreground text-sm">
        Камера {lesson.source_live_device_id} не найдена в реестре.
      </p>
    );
  }

  const title = formatLessonDisplayTitle(lesson);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/cameras/engagement?tab=lessons"
            className="text-muted-foreground inline-flex items-center gap-1 text-sm hover:text-foreground"
          >
            <MdArrowBack className="size-4" aria-hidden />
            К архиву уроков
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">
            Сохранённая live-сессия · таймлайн и инциденты как при отслеживании (без повторного
            Gemini-разбора урока)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" asChild>
          <Link
            href={`/dashboard/cameras/engagement/${encodeURIComponent(lesson.source_live_device_id!)}?sessionId=${encodeURIComponent(lesson.source_live_session_id!)}`}
          >
            Открыть камеру live
          </Link>
        </Button>
      </div>
      <LiveMonitorPanel
        camera={camera}
        initialSessionId={lesson.source_live_session_id}
        readOnly
      />
    </div>
  );
}
