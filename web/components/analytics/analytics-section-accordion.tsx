"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { directorKicker } from "@/components/director/shared/director-styles";
import type { AnalyticsSection } from "@/lib/analytics/types";
import { ANALYTICS_SECTION_LABELS } from "@/lib/analytics/role-presets";
import { cn } from "@/lib/utils";
import { MdExpandMore } from "react-icons/md";

type AnalyticsSectionAccordionProps = {
  sectionId: AnalyticsSection;
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function AnalyticsSectionAccordion({
  sectionId,
  title,
  description,
  defaultOpen = false,
  children,
}: AnalyticsSectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      id={`analytics-${sectionId}`}
      className="scroll-mt-24"
    >
      <div className={cn("rounded-2xl shadow-sm ring-1 ring-border/60")}>
        <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/30 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={directorKicker}>{ANALYTICS_SECTION_LABELS[sectionId]}</p>
              <h2 className="text-lg font-semibold tracking-tight">
                {title ?? ANALYTICS_SECTION_LABELS[sectionId]}
              </h2>
              {description ? (
                <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-9 gap-1">
                {open ? "Свернуть" : "Развернуть"}
                <MdExpandMore
                  className={cn("size-5 transition-transform", open && "rotate-180")}
                  aria-hidden
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="p-6">
          {open ? children : null}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
