"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsFilters } from "@/components/analytics/analytics-filters-provider";
import { useDirectorRole } from "@/lib/director/role-context";
import { canViewAnalyticsSection } from "@/lib/director/permissions";
import {
  ANALYTICS_SECTION_LABELS,
  getVisibleAnalyticsSections,
} from "@/lib/analytics/role-presets";
import type { AnalyticsSection } from "@/lib/analytics/types";
import { admNavActiveClass } from "@/lib/brand/ui-classes";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type AnalyticsSectionNavProps = {
  activeSection?: AnalyticsSection;
  onNavigate: (section: AnalyticsSection) => void;
};

export function AnalyticsSectionNav({
  activeSection,
  onNavigate,
}: AnalyticsSectionNavProps) {
  const { role } = useDirectorRole();
  const isMobile = useIsMobile();
  const sections = getVisibleAnalyticsSections(role).filter((s) =>
    canViewAnalyticsSection(role, s),
  );

  if (isMobile) {
    return (
      <Select
        value={activeSection ?? sections[0]}
        onValueChange={(v) => onNavigate(v as AnalyticsSection)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sections.map((section) => (
            <SelectItem key={section} value={section}>
              {ANALYTICS_SECTION_LABELS[section]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {sections.map((section) => (
          <Button
            key={section}
            type="button"
            variant={activeSection === section ? "default" : "outline"}
            size="sm"
            className={cn(
              activeSection === section && admNavActiveClass,
            )}
            onClick={() => onNavigate(section)}
          >
            {ANALYTICS_SECTION_LABELS[section]}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function AnalyticsSectionNavConnected() {
  const { section, setSection } = useAnalyticsFilters();
  return (
    <AnalyticsSectionNav
      activeSection={section}
      onNavigate={(s) => {
        setSection(s);
        const el = document.getElementById(`analytics-${s}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    />
  );
}
