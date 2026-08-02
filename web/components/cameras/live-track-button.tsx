"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MdPause, MdPlayArrow } from "react-icons/md";

type LiveTrackButtonProps = {
  isMonitoring: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function LiveTrackButton({
  isMonitoring,
  loading = false,
  disabled = false,
  onClick,
  size = "sm",
  className,
}: LiveTrackButtonProps) {
  return (
    <Button
      type="button"
      size={size}
      variant={isMonitoring ? "outline" : "default"}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(className)}
    >
      {isMonitoring ? (
        <>
          <MdPause className="size-4" aria-hidden />
          Остановить
        </>
      ) : (
        <>
          <MdPlayArrow className="size-4" aria-hidden />
          Отслеживать
        </>
      )}
    </Button>
  );
}
