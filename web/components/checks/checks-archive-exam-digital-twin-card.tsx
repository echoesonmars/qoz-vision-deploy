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
import { twinBoxes, twinCopy } from "@/lib/data/stubs/checks/archive-mock";
import { cn } from "@/lib/utils";

export function ChecksArchiveExamDigitalTwinCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Цифровой двойник</p>
        <CardTitle className="text-lg font-semibold">Профиль работы</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Скан с разметкой и панель Sozley: OCR, логика, итог.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-0 lg:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">
            Скан
          </p>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/50 ring-1 ring-border/40">
            <div
              aria-hidden
              className="absolute inset-6 rounded-lg border border-dashed border-border bg-card/70"
            />
            {twinBoxes.map((box) => (
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
        <div className="flex min-h-0 flex-col">
          <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">
            Анализ
          </p>
          <Tabs defaultValue="ocr" className="flex min-h-0 flex-1 flex-col gap-3">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1">
              <TabsTrigger value="ocr" className="text-xs sm:text-sm">
                Сырой OCR
              </TabsTrigger>
              <TabsTrigger value="logic" className="text-xs sm:text-sm">
                Логика Sozley
              </TabsTrigger>
              <TabsTrigger value="final" className="text-xs sm:text-sm">
                Итог
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ocr" className="min-h-0 flex-1 outline-none">
              <ScrollArea className="h-56 rounded-xl border border-border/60 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{twinCopy.rawOcr}</p>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="logic" className="min-h-0 flex-1 outline-none">
              <ScrollArea className="h-56 rounded-xl border border-border/60 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{twinCopy.logic}</p>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="final" className="min-h-0 flex-1 outline-none">
              <ScrollArea className="h-56 rounded-xl border border-border/60 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{twinCopy.finalEval}</p>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
