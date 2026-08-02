import { formatSourceBadge } from "@/lib/director/integrations/facade";
import { admConnectedDotClass } from "@/lib/brand/ui-classes";
import type { IntegrationSource } from "@/lib/director/types";
import { cn } from "@/lib/utils";

type DirectorSourceBadgeProps = {
  source: IntegrationSource;
  realtime?: boolean;
  className?: string;
};

export function DirectorSourceBadge({ source, realtime, className }: DirectorSourceBadgeProps) {
  const label = formatSourceBadge(source);
  if (!label) return null;
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center gap-1 text-[11px]",
        className,
      )}
    >
      {realtime ? (
        <span className={cn("size-1.5 rounded-full", admConnectedDotClass)} aria-hidden />
      ) : null}
      {label}
    </span>
  );
}
