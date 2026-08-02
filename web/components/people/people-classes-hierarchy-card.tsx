"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { classHierarchyRoots } from "@/lib/data/stubs/people/classes-mock";
import { MdExpandMore, MdAccountTree } from "react-icons/md";

export function PeopleClassesHierarchyCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdAccountTree className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Структура
        </p>
        <CardTitle className="text-lg font-semibold">Параллели и классы</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Классные руководители, численность, старосты (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {classHierarchyRoots.map((root) => (
          <Collapsible key={root.id} defaultOpen className="group rounded-xl border border-border/60 bg-card/40">
            <CollapsibleTrigger className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold hover:text-primary">
              <MdExpandMore
                className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                aria-hidden
              />
              {root.title}
              <span className="text-muted-foreground ml-auto font-normal tabular-nums">
                {root.studentCount} уч.
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="text-muted-foreground border-t border-border/60 px-4 py-2 text-xs">
                Куратор: {root.headTeacher}
              </div>
              <ul className="space-y-1 px-4 pb-3">
                {root.children?.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm"
                  >
                    {c.label}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
