"use client";

import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IncidentDeleteControlProps = {
  busy?: boolean;
  onConfirm: () => void;
  className?: string;
  confirmClassName?: string;
};

export function IncidentDeleteControl({
  busy = false,
  onConfirm,
  className,
  confirmClassName,
}: IncidentDeleteControlProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (confirmDelete) {
    return (
      <div
        className={cn(
          "w-full basis-full flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3",
          confirmClassName,
        )}
      >
        <p className="text-sm text-destructive">Удалить видео и запись инцидента?</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-9 flex-1 min-w-[7rem]"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(false);
              onConfirm();
            }}
          >
            Да, удалить
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 flex-1 min-w-[7rem]"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(false);
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-9 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        setConfirmDelete(true);
      }}
    >
      <MdDelete className="size-4" aria-hidden />
      Удалить
    </Button>
  );
}
