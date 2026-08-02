"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  KnowledgeScaleKey,
  KnowledgeStandardKey,
  KnowledgeSubjectKey,
} from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import {
  knowledgeScaleLabels,
  knowledgeStandardLabels,
  knowledgeSubjects,
  knowledgeSubjectLabels,
  knowledgeStandards,
} from "@/lib/data/stubs/dashboard/knowledge-map-mock";
import { cn } from "@/lib/utils";
import { MdFilterList } from "react-icons/md";

const tabsListBase = cn(
  "!grid min-h-9 w-full rounded-lg bg-muted p-1 sm:min-h-10",
  "!h-auto gap-1 overflow-hidden shadow-none",
);

const tabTriggerContained = cn(
  "box-border flex h-full max-h-full min-h-0 min-w-0 rounded-md px-2 py-2 text-xs",
  "items-center justify-center text-center leading-tight whitespace-normal sm:text-sm",
  "shadow-none after:hidden",
  "data-active:z-0 data-active:bg-background data-active:shadow-none dark:data-active:bg-input/40",
  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
);

type KnowledgeMapToolbarProps = {
  subject: KnowledgeSubjectKey;
  onSubjectChange: (value: KnowledgeSubjectKey) => void;
  standard: KnowledgeStandardKey;
  onStandardChange: (value: KnowledgeStandardKey) => void;
  scale: KnowledgeScaleKey;
  onScaleChange: (value: KnowledgeScaleKey) => void;
  className?: string;
};

export function KnowledgeMapToolbar({
  subject,
  onSubjectChange,
  standard,
  onStandardChange,
  scale,
  onScaleChange,
  className,
}: KnowledgeMapToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border/50 bg-muted/30 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <MdFilterList className="text-primary size-5 shrink-0" aria-hidden />
        <p className="text-xs font-medium uppercase tracking-wider">
          Фильтрация и масштаб
        </p>
      </div>
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-1.5">
          <Label className="text-xs text-muted-foreground">Масштаб</Label>
          <Select value={scale} onValueChange={(value) => onScaleChange(value as KnowledgeScaleKey)}>
            <SelectTrigger size="sm" className="h-8 w-full min-w-0">
              <SelectValue placeholder="Выберите масштаб" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Детализация</SelectLabel>
                {(Object.keys(knowledgeScaleLabels) as KnowledgeScaleKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {knowledgeScaleLabels[key]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <Label className="text-xs text-muted-foreground">Предмет STEM</Label>
          <Tabs
            value={subject}
            onValueChange={(value) => onSubjectChange(value as KnowledgeSubjectKey)}
          >
            <TabsList className={cn(tabsListBase, "grid-cols-4")}>
              {knowledgeSubjects.map((key) => (
                <TabsTrigger key={key} value={key} className={tabTriggerContained}>
                  {knowledgeSubjectLabels[key]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <Label className="text-xs text-muted-foreground">Сетка стандартов</Label>
          <Tabs
            value={standard}
            onValueChange={(value) =>
              onStandardChange(value as KnowledgeStandardKey)
            }
          >
            <TabsList className={cn(tabsListBase, "grid-cols-3")}>
              {knowledgeStandards.map((key) => (
                <TabsTrigger key={key} value={key} className={tabTriggerContained}>
                  {knowledgeStandardLabels[key]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
