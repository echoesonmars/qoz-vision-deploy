"use client";

import { admStatusSuccessSoftClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type DirectorMockFeedbackProps = {
  message: string | null;
  className?: string;
};

export function DirectorMockFeedback({ message, className }: DirectorMockFeedbackProps) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-lg px-4 py-2 text-sm",
        admStatusSuccessSoftClass,
        className,
      )}
    >
      {message}
    </p>
  );
}
