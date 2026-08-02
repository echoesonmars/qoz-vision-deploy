"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExportRecipientConfig } from "@/lib/exports/export-recipients";

type ExportRecipientCardProps = {
  config: ExportRecipientConfig;
  onGenerate: () => void;
};

export function ExportRecipientCard({ config, onGenerate }: ExportRecipientCardProps) {
  const Icon = config.icon;

  return (
    <Card size="sm" className="bg-muted/20 ring-1 ring-border/50 transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <Icon className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold leading-snug">
                {config.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs">{config.formatLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {config.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-[10px] font-normal">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <CardDescription className="pt-2 text-sm leading-relaxed">
          {config.desc}
        </CardDescription>
        <ul className="text-muted-foreground mt-3 space-y-1.5 text-xs leading-relaxed">
          {config.bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="bg-primary mt-1.5 size-1 shrink-0 rounded-full" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardContent className="pt-0">
        <Button type="button" size="sm" className="w-full" onClick={onGenerate}>
          Сформировать
        </Button>
      </CardContent>
    </Card>
  );
}
