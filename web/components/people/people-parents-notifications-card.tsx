"use client";

import { useState } from "react";
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
import { notificationTriggers } from "@/lib/data/stubs/people/parents-mock";
import { MdNotificationsActive } from "react-icons/md";

export function PeopleParentsNotificationsCard() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationTriggers.map((t) => [t.id, t.enabled])),
  );

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdNotificationsActive
            className="mr-1 inline size-4 align-text-bottom text-primary"
            aria-hidden
          />
          Триггеры
        </p>
        <CardTitle className="text-lg font-semibold">Шлюз уведомлений</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          WhatsApp/SMS отчёты по порогам (демо).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {notificationTriggers.map((t) => {
          const isOn = enabled[t.id] ?? false;
          return (
            <div
              key={t.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-snug">{t.label}</p>
                <Badge variant="outline" className="font-normal">
                  {t.channel === "whatsapp" ? "WhatsApp" : "SMS"}
                </Badge>
              </div>
              <Button
                type="button"
                variant={isOn ? "default" : "outline"}
                size="sm"
                className={isOn ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setEnabled((prev) => ({ ...prev, [t.id]: !isOn }))}
              >
                {isOn ? "Включено" : "Выключено"}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
