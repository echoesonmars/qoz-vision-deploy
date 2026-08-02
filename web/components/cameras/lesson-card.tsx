"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LessonCardPreview } from "@/components/cameras/lesson-card-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { admStatusSuccessSoftClass } from "@/lib/brand/ui-classes";
import { formatLessonDisplayTitle } from "@/lib/live-archive-title";
import { isLessonAnalyzing, lessonLanguageLabel, lessonStatusLabel } from "@/lib/lessons-display";
import type { LessonRow } from "@/lib/lessons-types";
import { cn } from "@/lib/utils";

type LessonCardProps = {
  lesson: LessonRow;
  onOpen: () => void;
};

function statusBadgeClass(status: string, isLiveArchive: boolean): string {
  if (isLiveArchive) return "bg-primary/15 text-primary";
  if (status === "pending" || status === "processing") {
    return "bg-[var(--status-warning)]/15 text-[var(--status-warning)]";
  }
  if (status === "failed") return "bg-destructive/15 text-destructive";
  return admStatusSuccessSoftClass;
}

export function LessonCard({ lesson, onOpen }: LessonCardProps) {
  const score = lesson.analysis?.lesson_overview.overall_engagement_score;
  const langLabel = lessonLanguageLabel(lesson.detected_language);
  const isLiveArchive = Boolean(lesson.source_live_session_id);
  const title = formatLessonDisplayTitle(lesson);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex h-full cursor-pointer flex-col gap-0 overflow-hidden py-0 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative">
        <LessonCardPreview lessonId={lesson.id} pending={isLessonAnalyzing(lesson.status)} />
        {score != null ? (
          <span className="absolute top-3 right-3 z-10 rounded-lg bg-black/60 px-2 py-1 text-sm font-semibold tabular-nums text-white">
            {Math.round(score)}%
          </span>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-bold leading-snug">{title}</h3>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge className={cn("font-medium", statusBadgeClass(lesson.status, isLiveArchive))}>
              {lessonStatusLabel(lesson.status, lesson.source_live_session_id)}
            </Badge>
            {langLabel ? (
              <Badge variant="outline" className="text-xs">
                {langLabel}
              </Badge>
            ) : null}
          </div>
        </div>
        {isLiveArchive ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            Запись live-мониторинга · таймлайн и инциденты сессии
          </p>
        ) : lesson.status === "failed" && lesson.error_message ? (
          <p className="line-clamp-2 text-sm text-destructive">{lesson.error_message}</p>
        ) : (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {lesson.analysis?.lesson_overview.pedagogical_style ??
              "Отчёт появится после обработки видео"}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t border-border/60 px-4 pb-4 pt-3 text-xs text-muted-foreground">
        {format(new Date(lesson.created_at), "dd MMMM yyyy, HH:mm", { locale: ru })}
      </CardFooter>
    </Card>
  );
}
