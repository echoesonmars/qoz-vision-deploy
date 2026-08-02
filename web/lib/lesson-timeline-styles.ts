import type { LessonTimelineEvent } from "@/lib/lessons-types";
import { cn } from "@/lib/utils";

export function timelineEventTone(eventType: string): string {
  if (eventType === "Infraction") {
    return "bg-destructive border-destructive text-destructive-foreground";
  }
  if (eventType === "Engagement Drop") {
    return "bg-amber-500 border-amber-600 text-amber-950";
  }
  if (eventType === "Phase") {
    return "bg-violet-600 border-violet-700 text-white";
  }
  return "bg-primary border-primary text-primary-foreground";
}

export function timelineEventRowClass(
  event: LessonTimelineEvent,
  active: boolean,
): string {
  return cn(
    "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
    active
      ? "border-primary bg-primary/10"
      : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40",
  );
}
