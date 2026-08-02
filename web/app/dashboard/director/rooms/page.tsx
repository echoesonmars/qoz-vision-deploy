import Link from "next/link";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { directorDetailRepo } from "@/lib/data";

const WIFI_LABELS = {
  stable: "Стабильно",
  unstable: "Нестабильно",
  offline: "Офлайн",
} as const;

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function DirectorRoomsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const rooms =
    filter === "issues"
      ? directorDetailRepo.getRooms().filter((r) => r.readiness !== "ready")
      : directorDetailRepo.getRooms();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: filter === "issues" ? "Кабинеты с проблемами" : "Кабинеты" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">
          {filter === "issues" ? "Тех. проблемы — кабинеты" : "Кабинеты школы"}
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">На главный экран</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Кабинет</TableHead>
              <TableHead>Интернет</TableHead>
              <TableHead>Оборудование</TableHead>
              <TableHead>Готовность</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/director/rooms/${room.id}`}
                    className="font-medium hover:text-primary"
                  >
                    {room.number}
                  </Link>
                </TableCell>
                <TableCell>{WIFI_LABELS[room.wifiStatus]}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">{room.equipment}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      room.readiness === "ready"
                        ? "default"
                        : room.readiness === "critical"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {directorDetailRepo.getRoomStatusLabels()[room.readiness]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href="/dashboard/management/map">Карта кабинетов</Link>
      </Button>
    </div>
  );
}
