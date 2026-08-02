import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { directorKicker, directorSectionCard } from "@/components/director/shared/director-styles";
import { cn } from "@/lib/utils";

type DirectorSectionProps = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function DirectorSection({
  id,
  kicker,
  title,
  description,
  children,
  action,
  className,
}: DirectorSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <Card className={directorSectionCard}>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 bg-muted/30">
          <div className="space-y-1">
            <p className={directorKicker}>{kicker}</p>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description ? (
              <CardDescription className="max-w-3xl text-sm leading-relaxed">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </section>
  );
}
