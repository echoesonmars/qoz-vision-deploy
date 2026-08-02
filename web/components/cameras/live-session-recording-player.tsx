"use client";

import { useEffect, useState } from "react";
import { fetchLiveRecordingUrl } from "@/lib/cameras/live-monitor-client";
import type { LiveMonitorSession } from "@/lib/cameras/live-analysis-types";
import { MdMovie } from "react-icons/md";

type LiveSessionRecordingPlayerProps = {
  session: LiveMonitorSession | null;
};

export function LiveSessionRecordingPlayer({ session }: LiveSessionRecordingPlayerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.id || session.recordingUploadStatus !== "ready") {
      setUrl(null);
      setError(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const signed = await fetchLiveRecordingUrl(session.id);
        if (!cancelled) {
          setUrl(signed);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setUrl(null);
          setError(e instanceof Error ? e.message : "Не удалось загрузить запись");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.id, session?.recordingUploadStatus]);

  if (!session) return null;

  if (session.recordingUploadStatus === "uploading") {
    return (
      <p className="text-muted-foreground text-sm">
        Загрузка записи… После этого урок появится во вкладке «Архив уроков» (1–2 мин).
      </p>
    );
  }

  if (session.recordingUploadStatus === "failed") {
    return (
      <p className="text-destructive text-sm">
        Запись не сохранена
      </p>
    );
  }

  if (session.recordingUploadStatus !== "ready") {
    return null;
  }

  return (
    <section className="space-y-2">
      <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium uppercase tracking-wide">
        <MdMovie className="size-4 text-primary" aria-hidden />
        Архив сессии
      </p>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {url ? (
        <video
          src={url}
          controls
          playsInline
          className="aspect-video w-full rounded-xl border border-border/70 bg-black"
        />
      ) : (
        <p className="text-muted-foreground text-sm">Подготовка плеера…</p>
      )}
    </section>
  );
}
