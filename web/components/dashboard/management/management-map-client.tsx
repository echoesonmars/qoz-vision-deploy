"use client";

import Link from "next/link";
import { summaryCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { directorDetailRepo } from "@/lib/data";
import type { RoomReadinessStatus } from "@/lib/director/types";
import { cn } from "@/lib/utils";
import { MdLayers, MdMap, MdVideocam } from "react-icons/md";

const floors = [
  { name: "Этаж 3", rooms: ["301", "302", "303", "304", "305"] },
  { name: "Этаж 2", rooms: ["201", "202", "203", "Лаб.", "204"] },
  { name: "Этаж 1", rooms: ["101", "102", "Вестибюль", "103", "104", "105"] },
] as const;

const RISK_STYLES = {
  high: "ring-destructive/60 bg-destructive/10",
  medium: "ring-[var(--status-warning)]/60 bg-[var(--status-warning)]/10",
  low: "ring-primary/40 bg-primary/5",
} as const;

const READINESS_STYLES: Record<RoomReadinessStatus, string> = {
  ready: "border-[var(--status-success)]/40",
  needs_equipment: "border-[var(--status-warning)]/40",
  repair: "border-[var(--status-warning)]/50",
  critical: "border-destructive/60",
};

function roomReadiness(number: string): RoomReadinessStatus | null {
  const room = directorDetailRepo.getRooms().find((r) => r.number === number);
  return room?.readiness ?? null;
}

function roomHref(number: string): string | null {
  const room = directorDetailRepo.getRooms().find((r) => r.number === number);
  return room ? `/dashboard/director/rooms/${room.id}` : null;
}

export function ManagementMapClient() {
  return (
    <Card className={summaryCardInteractive}>
      <CardHeader className="border-b border-border/60 bg-muted/30">
        <p className={summaryKicker}>Управление</p>
        <CardTitle className="text-xl font-semibold">Кабинеты и карта</CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-relaxed">
          Физическая карта школы с этажами, статусом кабинетов и слоем риска.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/40 p-4 ring-1 ring-border/30">
          <MdMap className="text-primary size-5 shrink-0" aria-hidden />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Цвет рамки — готовность кабинета. Точки риска — последние инциденты.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {directorDetailRepo.getMapIncidentPins().map((pin) => (
            <Button key={pin.id} asChild variant="outline" size="sm">
              <Link href={`/dashboard/director/security/${pin.id}`}>
                <span
                  className={cn("mr-2 inline-block size-2 rounded-full", {
                    "bg-destructive": pin.risk === "high",
                    "bg-[var(--status-warning)]": pin.risk === "medium",
                    "bg-primary": pin.risk === "low",
                  })}
                />
                {pin.room} — инцидент
              </Link>
            </Button>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {floors.map((floor) => (
            <Card key={floor.name} size="sm" className="bg-card/80 ring-1 ring-border/50">
              <CardHeader className="border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <MdLayers className="text-primary size-4" aria-hidden />
                  <CardTitle className="text-base font-semibold">{floor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {floor.rooms.map((room) => {
                    const readiness = roomReadiness(room);
                    const href = roomHref(room);
                    const pin = directorDetailRepo.getMapIncidentPins().find((p) => p.room === room);
                    const content = (
                      <>
                        {room}
                        {readiness ? (
                          <Badge variant="outline" className="mt-1 text-[10px]">
                            {directorDetailRepo.getRoomStatusLabels()[readiness]}
                          </Badge>
                        ) : null}
                      </>
                    );
                    return href ? (
                      <Button
                        key={room}
                        asChild
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-auto min-h-10 flex-col justify-center px-2 py-2 text-xs font-medium",
                          readiness ? READINESS_STYLES[readiness] : "",
                          pin ? RISK_STYLES[pin.risk] : "",
                        )}
                      >
                        <Link href={href}>{content}</Link>
                      </Button>
                    ) : (
                      <Button
                        key={room}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-auto min-h-10 flex-col justify-center px-2 py-2 text-xs font-medium",
                          pin ? RISK_STYLES[pin.risk] : "",
                        )}
                      >
                        {content}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-4 border-t border-border/50 pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <MdVideocam className="text-primary size-4" aria-hidden />
            Drill-down кабинета → камера
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
