"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LessonGrid } from "@/components/cameras/lesson-grid";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { LessonsToolbar } from "@/components/cameras/lessons-toolbar";
import { UploadDialog } from "@/components/cameras/upload-dialog";
import { filterLessons } from "@/lib/lessons-filter";
import { isLessonAnalyzing } from "@/lib/lessons-display";
import { lessonsSnapshot } from "@/lib/lessons-snapshot";
import type { LessonRow } from "@/lib/lessons-types";

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_TICKS = 36;

function applyLessons(prev: LessonRow[], next: LessonRow[]): LessonRow[] {
  return lessonsSnapshot(prev) === lessonsSnapshot(next) ? prev : next;
}

export function LessonsPageClient() {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const pollTicksRef = useRef(0);
  const analyzeTriggeredRef = useRef<Set<string>>(new Set());

  const fetchLessons = useCallback(async (): Promise<LessonRow[] | null> => {
    try {
      const res = await fetch("/api/lessons");
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? res.statusText);
      }
      setLoadError(null);
      return data as LessonRow[];
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Не удалось загрузить список");
      return null;
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const data = await fetchLessons();
    if (data) {
      setLessons((prev) => applyLessons(prev, data));
    }
    setLoading(false);
  }, [fetchLessons]);

  const reloadList = useCallback(async () => {
    const data = await fetchLessons();
    if (data) {
      setLessons((prev) => applyLessons(prev, data));
    }
  }, [fetchLessons]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const pendingKey = useMemo(() => {
    return lessons
      .filter((row) => row.status === "pending" && !row.source_live_session_id)
      .map((row) => row.id)
      .sort()
      .join(",");
  }, [lessons]);

  useEffect(() => {
    if (!pendingKey) {
      pollTicksRef.current = 0;
      return;
    }

    const ids = pendingKey.split(",");
    for (const id of ids) {
      if (analyzeTriggeredRef.current.has(id)) continue;
      analyzeTriggeredRef.current.add(id);
      void fetch("/api/lessons/retry-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: id }),
      });
    }
  }, [pendingKey]);

  useEffect(() => {
    const hasPending = lessons.some(
      (l) => isLessonAnalyzing(l.status) && !l.source_live_session_id,
    );
    if (!hasPending) return;

    const timer = setInterval(() => {
      if (pollTicksRef.current >= MAX_POLL_TICKS) return;
      pollTicksRef.current += 1;
      void reloadList();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [lessons, reloadList]);

  const filteredLessons = useMemo(
    () => filterLessons(lessons, { search, date }),
    [lessons, search, date],
  );

  return (
    <div className="flex flex-col gap-4">
      <LessonsToolbar
        search={search}
        onSearchChange={setSearch}
        date={date}
        onDateChange={setDate}
        onUploadClick={() => setUploadOpen(true)}
      />
      {loadError ? (
        <p className="text-destructive text-sm">{loadError}</p>
      ) : loading && lessons.length === 0 ? (
        <AdmLoadingScreen variant="inline" />
      ) : lessons.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Нет уроков в архиве. Загрузите видео вручную или остановите live-мониторинг — запись
          добавится сюда автоматически после загрузки mp4.
        </p>
      ) : filteredLessons.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ничего не найдено по выбранным фильтрам.</p>
      ) : (
        <LessonGrid
          lessons={filteredLessons}
          onSelect={(row) => router.push(`/dashboard/cameras/engagement/${row.id}`)}
        />
      )}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        uploadUrl="/api/lessons"
        hintAfterPick="ИИ проанализирует урок и построит таймлайн"
        onUploaded={() => {
          pollTicksRef.current = 0;
          analyzeTriggeredRef.current.clear();
          void reloadList();
        }}
      />
    </div>
  );
}
