import type { ReactNode } from "react";
import { formatSharePercent } from "@/lib/director/format-metric-value";
import { cn } from "@/lib/utils";

type DirectorCountPercentValueProps = {
  count: number;
  total: number;
  fractionDigits?: number;
  className?: string;
  percentClassName?: string;
};

export function DirectorCountPercentValue({
  count,
  total,
  fractionDigits = 1,
  className,
  percentClassName,
}: DirectorCountPercentValueProps) {
  return (
    <span className={cn("tabular-nums", className)}>
      {count.toLocaleString("ru-RU")}
      <span
        className={cn(
          "text-muted-foreground ml-1.5 text-[0.72em] font-normal",
          percentClassName,
        )}
      >
        ({formatSharePercent(count, total, fractionDigits)})
      </span>
    </span>
  );
}

type DirectorRatioPercentValueProps = {
  numerator: number;
  denominator: number;
  fractionDigits?: number;
  suffix?: ReactNode;
};

export function DirectorRatioPercentValue({
  numerator,
  denominator,
  fractionDigits = 0,
  suffix,
}: DirectorRatioPercentValueProps) {
  return (
    <span className="tabular-nums">
      {numerator}/{denominator}
      <span className="text-muted-foreground ml-1.5 text-[0.72em] font-normal">
        ({formatSharePercent(numerator, denominator, fractionDigits)})
      </span>
      {suffix}
    </span>
  );
}
