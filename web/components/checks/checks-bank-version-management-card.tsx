"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  checksCardHeader,
  checksCardInteractive,
  summaryKicker,
} from "@/components/dashboard/summary-card-shell";
import { versionMgmt } from "@/lib/data/stubs/checks/bank-mock";
import { MdPublish, MdLock } from "react-icons/md";

export function ChecksBankVersionManagementCard() {
  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>Версии</p>
        <CardTitle className="text-lg font-semibold">Управление выпусками</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Контур раскрытия ответов и старт сессии экзамена (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {versionMgmt.revealAnswersLocked ? (
              <Badge variant="secondary" className="gap-1 pr-2">
                <MdLock className="size-3.5" aria-hidden />
                Ответы скрыты
              </Badge>
            ) : (
              <Badge className="bg-primary text-primary-foreground">Ответы открыты</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Старт экзамена:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {versionMgmt.examStartsAt}
            </span>
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 sm:items-end">
          <Button type="button" variant="outline" className="gap-2">
            <MdPublish className="text-primary size-4" aria-hidden />
            Опубликовать набор Б
          </Button>
          <Button type="button" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Зафиксировать окно доступа
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
