"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LessonLiveSessionLink } from "@/components/cameras/lesson-live-session-link";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { LessonIncidentsSummary } from "@/components/cameras/lesson-incidents-summary";
import { LessonOverviewCards } from "@/components/cameras/lesson-overview-cards";
import { LessonPhaseBar } from "@/components/cameras/lesson-phase-bar";
import { LessonTimelineList } from "@/components/cameras/lesson-timeline-list";
import { LessonTimelineTrack } from "@/components/cameras/lesson-timeline-track";
import { Button } from "@/components/ui/button";
import { isLessonAnalyzing, lessonLanguageLabel } from "@/lib/lessons-display";
import { formatSeconds, parseMmSs } from "@/lib/lesson-time";
import type { LessonAnalysisReport, LessonRow } from "@/lib/lessons-types";

const POLL_INTERVAL_MS = 10_000;

type LessonDetailClientProps = {
  lessonId: string;
};

export function LessonDetailClient({ lessonId }: LessonDetailClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<LessonRow | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);
  const [retryBusy, setRetryBusy] = useState(false);
  const [stopBusy, setStopBusy] = useState(false);

  const fetchLesson = useCallback(async () => {
    const res = await fetch(`/api/lessons/${lessonId}`);
    const data = (await res.json()) as LessonRow & { error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? res.statusText);
    }
    setLesson(data);
    return data;
  }, [lessonId]);

  const loadVideoUrl = useCallback(async () => {
    const res = await fetch(`/api/lessons/${lessonId}/signed-url`);
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) {
      throw new Error(data.error ?? res.statusText);
    }
    if (data.url) setVideoUrl(data.url);
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadError(null);
        await fetchLesson();
        await loadVideoUrl();
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Не удалось загрузить урок");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchLesson, loadVideoUrl]);

  useEffect(() => {
    if (!lesson || !isLessonAnalyzing(lesson.status)) return;
    const timer = setInterval(() => {
      void fetchLesson();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [lesson, fetchLesson]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoUrl) return;
    el.src = videoUrl;
    return () => {
      el.removeAttribute("src");
      el.load();
    };
  }, [videoUrl]);

  const analysis: LessonAnalysisReport | null = lesson?.analysis ?? null;

  const timeline = useMemo(() => analysis?.timeline ?? [], [analysis]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || timeline.length === 0) return;

    const onTimeUpdate = () => {
      const t = el.currentTime;
      setCurrentSeconds(t);
      let closest: string | null = null;
      let minDiff = Infinity;
      for (const event of timeline) {
        const diff = Math.abs(parseMmSs(event.timestamp) - t);
        if (diff < minDiff && diff < 4) {
          minDiff = diff;
          closest = event.timestamp;
        }
      }
      setActiveTimestamp(closest);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    return () => el.removeEventListener("timeupdate", onTimeUpdate);
  }, [timeline]);

  const seekTo = useCallback((seconds: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = seconds;
    setCurrentSeconds(seconds);
    void el.play().catch(() => {});
  }, []);

  async function handleStop() {
    setStopBusy(true);
    try {
      const res = await fetch("/api/lessons/cancel-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? res.statusText);
      }
      await fetchLesson();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Не удалось остановить анализ");
    } finally {
      setStopBusy(false);
    }
  }

  async function handleRetry() {
    setRetryBusy(true);
    try {
      const res = await fetch("/api/lessons/retry-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? res.statusText);
      }
      await fetchLesson();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Не удалось запустить анализ");
    } finally {
      setRetryBusy(false);
    }
  }

  if (loadError && !lesson) {
    return (
      <p className="text-destructive text-sm">
        {loadError}{" "}
        <Link href="/dashboard/cameras/engagement" className="underline">
          Назад к списку
        </Link>
      </p>
    );
  }

  if (!lesson) {
    return <AdmLoadingScreen variant="inline" message="Загрузка урока…" />;
  }

  const title =
    lesson.title?.trim() ||
    `Урок от ${format(new Date(lesson.created_at), "dd.MM.yyyy HH:mm", { locale: ru })}`;
  const langLabel = lessonLanguageLabel(lesson.detected_language);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(new Date(lesson.created_at), "dd MMMM yyyy, HH:mm", { locale: ru })}
            {langLabel ? ` · ${langLabel}` : null}
            {isLessonAnalyzing(lesson.status) ? " · Анализ…" : null}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/cameras/engagement">К списку уроков</Link>
        </Button>
      </div>

      <LessonLiveSessionLink lesson={lesson} />

      <section className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-border/70 bg-black shadow-lg">
          <video
            ref={videoRef}
            controls
            playsInline
            className="aspect-video w-full bg-black"
          />
        </div>
        {analysis ? (
          <LessonPhaseBar
            phases={analysis.time_management}
            lessonDuration={analysis.lesson_overview.duration}
            currentSeconds={currentSeconds}
            onSeek={seekTo}
          />
        ) : null}
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatSeconds(currentSeconds)}
          {analysis ? ` / ${analysis.lesson_overview.duration}` : null}
        </p>
      </section>

      {isLessonAnalyzing(lesson.status) ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Видео загружено. ИИ анализирует урок — подождите или остановите анализ.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={stopBusy}
            onClick={() => void handleStop()}
          >
            {stopBusy ? "Остановка…" : "Остановить анализ"}
          </Button>
        </div>
      ) : null}

      {lesson.status === "failed" ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {lesson.error_message ?? "Анализ не удался"}
          </p>
          <Button
            type="button"
            variant="destructive"
            className="mt-3"
            disabled={retryBusy}
            onClick={() => void handleRetry()}
          >
            {retryBusy ? "Запуск…" : "Повторить анализ"}
          </Button>
        </div>
      ) : null}

      {analysis ? (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Обзор урока</h2>
            <LessonOverviewCards overview={analysis.lesson_overview} />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Фазы урока</h2>
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[32rem] text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Фаза</th>
                    <th className="px-4 py-3 font-medium">Начало</th>
                    <th className="px-4 py-3 font-medium">Конец</th>
                    <th className="px-4 py-3 font-medium">Описание</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.time_management.map((phase) => (
                    <tr
                      key={`${phase.phase}-${phase.start_time}`}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">{phase.phase}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">{phase.start_time}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">{phase.end_time}</td>
                      <td className="px-4 py-3 text-muted-foreground">{phase.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Инциденты на уроке</h2>
            <LessonIncidentsSummary items={analysis.incidents_summary} />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Таймлайн событий</h2>
            <LessonTimelineTrack
              events={analysis.timeline}
              lessonDuration={analysis.lesson_overview.duration}
              currentSeconds={currentSeconds}
              onSeek={seekTo}
            />
            <LessonTimelineList
              events={analysis.timeline}
              activeTimestamp={activeTimestamp}
              onSeek={seekTo}
            />
          </section>
        </>
      ) : null}
    </div>
  );
}
