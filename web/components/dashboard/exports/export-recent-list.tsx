"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { summaryKicker } from "@/components/dashboard/summary-card-shell";
import type { RecentExportEntry } from "@/lib/exports/export-types";
import { MdHistory } from "react-icons/md";

type ExportRecentListProps = {
  items: RecentExportEntry[];
};

export function ExportRecentList({ items }: ExportRecentListProps) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-border/60">
      <CardHeader className="border-b border-border/60 bg-muted/30 pb-3">
        <p className={summaryKicker}>История</p>
        <CardTitle className="text-base font-semibold">Последние выгрузки</CardTitle>
        <CardDescription className="text-sm">
          Сохраняется в сессии браузера (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Пока нет сформированных файлов. Запустите выгрузку у одного из получателей.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 rounded-lg bg-muted/30 p-3 ring-1 ring-border/40"
              >
                <MdHistory className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-medium">{item.fileName}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.typeLabel} ·{" "}
                    {new Date(item.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
