import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directorDetailRepo } from "@/lib/data";
import { MdCheckCircle, MdCancel } from "react-icons/md";

type PageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function DirectorRoomPage({ params }: PageProps) {
  const { roomId } = await params;
  const room = directorDetailRepo.getRoomDetail(roomId);
  if (!room) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Инфраструктура", href: "/dashboard#infrastructure" },
          { label: `Кабинет ${room.number}` },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Кабинет {room.number}</h1>
          <p className="text-muted-foreground text-sm">Этаж {room.floor}</p>
          <Badge variant="outline" className="mt-2">
            {directorDetailRepo.getRoomStatusLabels()[room.readiness]}
          </Badge>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
        <p className="mb-3 text-sm font-semibold">Оборудование</p>
        <ul className="space-y-2">
          {room.equipment.map((item) => (
            <li key={item.name} className="flex items-center gap-2 text-sm">
              {item.ok ? (
                <MdCheckCircle className="size-4 text-green-600" aria-hidden />
              ) : (
                <MdCancel className="size-4 text-destructive" aria-hidden />
              )}
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {room.tickets.length > 0 ? (
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">Заявки на ремонт</p>
          <ul className="space-y-2 text-sm">
            {room.tickets.map((t) => (
              <li key={t.id}>
                {t.title} — {t.status} ({t.date})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {room.schedule.length > 0 ? (
        <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border/50">
          <p className="mb-3 text-sm font-semibold">Расписание</p>
          <ul className="space-y-2 text-sm">
            {room.schedule.map((s) => (
              <li key={s.slot}>
                {s.slot}: {s.subject} — {s.teacher}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Button asChild size="sm" className="w-fit">
        <Link href={room.cameraHref}>Камера кабинета</Link>
      </Button>
    </div>
  );
}
