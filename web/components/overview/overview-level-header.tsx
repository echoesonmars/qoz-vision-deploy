import type { ReactNode } from "react";
import { MdLocationCity, MdMap, MdPlace, MdPublic } from "react-icons/md";

type OverviewLevel = "country" | "region" | "city" | "district";

type OverviewLevelHeaderProps = {
  level: OverviewLevel;
  title: string;
  subtitle?: string;
};

const LEVEL_ICONS: Record<OverviewLevel, ReactNode> = {
  country: <MdPublic className="size-6" aria-hidden />,
  region: <MdMap className="size-6" aria-hidden />,
  city: <MdLocationCity className="size-6" aria-hidden />,
  district: <MdPlace className="size-6" aria-hidden />,
};

export function OverviewLevelHeader({ level, title, subtitle }: OverviewLevelHeaderProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-6 ring-1 ring-border/60">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
        aria-hidden
      >
        {LEVEL_ICONS[level]}
      </span>
      <div>
        <p className="text-lg font-semibold">{title}</p>
        {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
      </div>
    </div>
  );
}
