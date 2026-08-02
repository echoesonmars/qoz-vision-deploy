import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";

export default function DirectorActivityPage() {
  const activity = directorDetailRepo.getActivityFeed();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Лента активности" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Лента активности</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {activity.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex gap-4 rounded-xl bg-card/80 p-4 ring-1 ring-border/50 transition-colors hover:bg-muted/30"
          >
            <span className="text-muted-foreground w-14 shrink-0 text-xs">{item.time}</span>
            <span className="text-sm">{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
