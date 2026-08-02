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
import { Badge } from "@/components/ui/badge";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { CurriculumNode } from "@/lib/data/stubs/checks/bank-mock";
import { curriculumRoots } from "@/lib/data/stubs/checks/bank-mock";
import { cn } from "@/lib/utils";
import { MdExpandMore } from "react-icons/md";

function standardLabel(standard: CurriculumNode["standard"]) {
  if (standard === "nish") return "НИШ";
  if (standard === "mesk") return "МЕСК";
  return "ENT";
}

function CurriculumBranch({ node, depth }: { node: CurriculumNode; depth: number }) {
  const hasChildren = Boolean(node.children?.length);

  if (!hasChildren) {
    return (
      <li className={cn("py-1", depth > 0 && "ml-3 border-l border-border/60 pl-3")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{node.title}</span>
          <Badge variant="outline" className="text-[10px] font-normal">
            {standardLabel(node.standard)}
          </Badge>
        </div>
      </li>
    );
  }

  return (
    <li className={cn(depth > 0 && "ml-2 border-l border-border/40 pl-3")}>
      <Collapsible defaultOpen className="group">
        <div className="flex flex-wrap items-center gap-2 py-1">
          <CollapsibleTrigger className="flex items-center gap-1 text-left text-sm font-semibold hover:text-primary">
            <MdExpandMore
              className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
              aria-hidden
            />
            {node.title}
          </CollapsibleTrigger>
          <Badge variant="secondary" className="text-[10px] font-normal">
            {standardLabel(node.standard)}
          </Badge>
        </div>
        <CollapsibleContent>
          <ul className="mt-1 space-y-0.5 pb-2">
            {node.children?.map((child) => (
              <CurriculumBranch key={child.id} node={child} depth={depth + 1} />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

export function ChecksBankCurriculumTreeCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Критерии</p>
        <CardTitle className="text-lg font-semibold">Дерево учебной программы</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Узлы НИШ / МЕСК / ENT для привязки заданий (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1">
          {curriculumRoots.map((root) => (
            <CurriculumBranch key={root.id} node={root} depth={0} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
