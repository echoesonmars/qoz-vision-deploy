import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { summaryCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MessageCircle, Smartphone } from "lucide-react";

const channels = [
  {
    id: "sms",
    title: "SMS",
    body: "Родителям: краткие сводки посещаемости и успеваемости по расписанию.",
    icon: Smartphone,
  },
  {
    id: "messengers",
    title: "Мессенджеры",
    body: "Те же ИИ-сводки в подключённых каналах (мок подключения).",
    icon: MessageCircle,
  },
  {
    id: "email",
    title: "Почта учителей",
    body: "Отчёты и дайджесты Sozley / Qoz на корпоративную почту.",
    icon: Mail,
  },
];

export default function ManagementMessagingPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Рассылки и ИИ-отчёты" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Card className={summaryCardInteractive}>
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <p className={summaryKicker}>Управление</p>
            <CardTitle className="text-xl font-semibold">Рассылки и ИИ-отчёты</CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-relaxed">
              Автоматическая отправка ИИ-сводок успеваемости и посещаемости родителям (SMS и
              мессенджеры) и отчётов учителям на почту.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <Card key={ch.id} size="sm" className="bg-muted/20 ring-1 ring-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="text-primary size-5" aria-hidden />
                      <CardTitle className="text-base font-semibold">{ch.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{ch.body}</CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t border-border/40 pt-4">
                    <Badge variant="secondary" className="font-normal">
                      Модуль демо
                    </Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </CardContent>
          <CardContent className="border-t border-border/50 pb-6">
            <div className="bg-muted/30 flex flex-col gap-4 rounded-xl p-4 ring-1 ring-border/40 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                Настройте расписание и шаблоны сообщений во внедрении. Здесь только каркас
                интерфейса.
              </p>
              <Button type="button" variant="default" size="sm" disabled>
                Настроить сценарии
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
