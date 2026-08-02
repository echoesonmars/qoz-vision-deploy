"use client";

import Link from "next/link";
import { MdLiveTv } from "react-icons/md";
import type { LessonRow } from "@/lib/lessons-types";

type LessonLiveSessionLinkProps = {
  lesson: LessonRow;
};

export function LessonLiveSessionLink({ lesson }: LessonLiveSessionLinkProps) {
  if (!lesson.source_live_session_id || !lesson.source_live_device_id) {
    return null;
  }
  const href = `/dashboard/cameras/engagement/${encodeURIComponent(lesson.source_live_device_id)}?sessionId=${encodeURIComponent(lesson.source_live_session_id)}`;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      <p className="flex items-center gap-2 font-medium">
        <MdLiveTv className="size-4 text-primary" aria-hidden />
        Создано из live-сессии
      </p>
      <p className="text-muted-foreground mt-1 text-xs font-mono">
        {lesson.source_live_session_id.slice(0, 8)}… · {lesson.source_live_device_id}
      </p>
      <Link href={href} className="text-primary mt-2 inline-block text-xs font-medium hover:underline">
        Открыть таймлайн live-сессии
      </Link>
    </div>
  );
}
