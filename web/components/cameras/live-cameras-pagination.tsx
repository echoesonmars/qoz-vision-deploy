"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LiveCamerasPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function pageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function LiveCamerasPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: LiveCamerasPaginationProps) {
  if (totalPages <= 1) return null;

  const nums = pageNumbers(page, totalPages);

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Button>
      {nums.map((n, i) => {
        const prev = nums[i - 1];
        const gap = prev !== undefined && n - prev > 1;
        return (
          <span key={n} className="flex items-center gap-2">
            {gap ? <span className="text-muted-foreground px-1 text-sm">…</span> : null}
            <Button
              type="button"
              variant={n === page ? "default" : "outline"}
              size="sm"
              className="min-w-9"
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          </span>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперёд
      </Button>
    </div>
  );
}
