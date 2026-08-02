"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import type { StudentTwinData } from "@/lib/data/stubs/people/students-mock";
import { cn } from "@/lib/utils";
import { MdPerson } from "react-icons/md";

type PeopleStudentsTwinCardProps = {
  twin: StudentTwinData;
};

export function PeopleStudentsTwinCard({ twin }: PeopleStudentsTwinCardProps) {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdPerson className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Двойник
        </p>
        <CardTitle className="text-lg font-semibold">Цифровой профиль</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Успеваемость и карта знаний (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="grades" className="flex flex-col gap-3">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1">
            <TabsTrigger value="grades" className="text-xs sm:text-sm">
              Успеваемость
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs sm:text-sm">
              Карта знаний
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grades" className="space-y-4 outline-none">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-muted-foreground text-sm">GPA (демо)</span>
              <span className="text-primary text-xl font-semibold tabular-nums">{twin.gpa}</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                  Скан работы
                </p>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/50 ring-1 ring-border/40">
                  <div
                    aria-hidden
                    className="absolute inset-6 rounded-lg border border-dashed border-border bg-card/70"
                  />
                  {twin.scanBoxes.map((box) => (
                    <div
                      key={box.id}
                      className={cn(
                        "absolute rounded-md border-2 bg-background/40",
                        box.variant === "correct"
                          ? "border-primary bg-primary/20"
                          : "border-destructive bg-destructive/15",
                      )}
                      style={{
                        left: box.left,
                        top: box.top,
                        width: box.width,
                        height: box.height,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                  Работы Sozley
                </p>
                <ScrollArea className="h-48 rounded-xl border border-border/60">
                  <ul className="space-y-2 p-3">
                    {twin.works.map((w) => (
                      <li key={w.id} className="text-sm">
                        <span className="font-medium">{w.title}</span>
                        <span className="text-muted-foreground ml-2 tabular-nums">
                          {w.score}/{w.max}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="map" className="outline-none">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                  Освоено
                </p>
                <ul className="flex flex-wrap gap-2">
                  {twin.masteredTopics.map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-primary/30 bg-primary/15 px-2 py-1 text-xs font-medium text-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                  Проблемные
                </p>
                <ul className="flex flex-wrap gap-2">
                  {twin.gapTopics.map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs font-medium"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
