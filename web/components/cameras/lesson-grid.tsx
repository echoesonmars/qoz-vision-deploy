"use client";

import { LessonCard } from "@/components/cameras/lesson-card";
import type { LessonRow } from "@/lib/lessons-types";

type LessonGridProps = {
  lessons: LessonRow[];
  onSelect: (lesson: LessonRow) => void;
};

export function LessonGrid({ lessons, onSelect }: LessonGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} onOpen={() => onSelect(lesson)} />
      ))}
    </div>
  );
}
