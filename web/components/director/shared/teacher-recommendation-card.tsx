import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { directorSectionCard } from "@/components/director/shared/director-styles";
import { admStatusSuccessSoftClass } from "@/lib/brand/ui-classes";
import type { TeacherRecommendation } from "@/lib/director/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<TeacherRecommendation["category"], string> = {
  mentor_candidate: "Кандидат в наставники",
  method_support: "Методическая поддержка",
  pk_module: "Модуль ПК",
  overload: "Перегрузка",
};

const CATEGORY_STYLES: Record<TeacherRecommendation["category"], string> = {
  mentor_candidate: cn(admStatusSuccessSoftClass, "border-[var(--status-success)]/30"),
  method_support: "bg-primary/10 text-primary border-primary/30",
  pk_module: "bg-muted text-foreground border-border",
  overload: "bg-[var(--status-warning)]/10 text-[var(--status-warning)] border-[var(--status-warning)]/30",
};

type TeacherRecommendationCardProps = {
  item: TeacherRecommendation;
  onScheduleMeeting?: () => void;
};

export function TeacherRecommendationCard({
  item,
  onScheduleMeeting,
}: TeacherRecommendationCardProps) {
  return (
    <Card className={cn(directorSectionCard, "h-full")}>
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <Badge variant="outline" className={cn("w-fit font-normal", CATEGORY_STYLES[item.category])}>
          {CATEGORY_LABELS[item.category]}
        </Badge>
        <div>
          <p className="font-semibold">{item.teacherName}</p>
          <p className="text-muted-foreground text-sm">
            {item.subject} · {item.classes} · стаж {item.experienceYears} г.
          </p>
        </div>
        <p className="text-sm leading-relaxed">
          <span className="text-muted-foreground">Причина: </span>
          {item.reason}
        </p>
        <p className="text-sm leading-relaxed">
          <span className="text-muted-foreground">Действие: </span>
          {item.action}
        </p>
        <p className="text-muted-foreground text-xs">Ответственный: {item.responsible}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={onScheduleMeeting}>
            Назначить встречу
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/director/teachers/${item.teacherId}`}>Подробнее</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
