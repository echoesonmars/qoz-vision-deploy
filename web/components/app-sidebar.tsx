"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { AdmLogo } from "@/components/brand/adm-logo"
import { ADM_COPY } from "@/lib/brand/copy"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Settings2,
  Users,
  Video,
} from "lucide-react"

const data = {
  teams: [
    {
      name: "Almaty Digital Mektebi",
      logo: <AdmLogo size="sm" />,
      plan: "Панель управления",
    },
  ],
  navMain: [
    {
      title: "Главная",
      url: "/dashboard",
      icon: <LayoutDashboard className="size-4" />,
      isActive: true,
      items: [
        { title: "Сводка", url: "/dashboard" },
        { title: "Аналитика", url: "/dashboard?tab=analytics" },
        { title: "Прогнозы успеваемости", url: "/dashboard/forecasts" },
        { title: "Карта знаний", url: "/dashboard/knowledge-map" },
      ],
    },
    {
      title: ADM_COPY.videoAnalyticsNav,
      url: "/dashboard/cameras/all",
      icon: <Video className="size-4" />,
      items: [
        { title: "Все камеры", url: "/dashboard/cameras/all" },
        { title: "Прямой эфир", url: "/dashboard/cameras/live" },
        { title: "Вовлеченность классов", url: "/dashboard/cameras/engagement" },
        { title: "Управление камерами", url: "/dashboard/cameras/manage" },
      ],
    },
    {
      title: "Проверка Sozley",
      url: "/checks/status",
      icon: <ClipboardCheck className="size-4" />,
      items: [
        { title: "Статус проверок", url: "/checks/status" },
        { title: "Архив работ", url: "/checks/archive" },
        { title: "Банк заданий", url: "/checks/bank" },
      ],
    },
    {
      title: "Люди",
      url: "/people/teachers",
      icon: <Users className="size-4" />,
      items: [
        { title: "Учителя", url: "/people/teachers" },
        { title: "Ученики", url: "/people/students" },
        { title: "Классы", url: "/people/classes" },
        { title: "Родители", url: "/people/parents" },
      ],
    },
    {
      title: "Управление",
      url: "/dashboard/management/map",
      icon: <Building2 className="size-4" />,
      items: [
        { title: "Кабинеты и карта", url: "/dashboard/management/map" },
        { title: "Рассылки и ИИ-отчёты", url: "/dashboard/management/messaging" },
        { title: "Расписание", url: "#" },
        { title: "Посещаемость", url: "#" },
        { title: "Выгрузка документов", url: "/dashboard/analytics/exports" },
      ],
    },
    {
      title: "Настройки",
      url: "/dashboard/settings/audit",
      icon: <Settings2 className="size-4" />,
      items: [
        { title: "История действий (Аудит)", url: "/dashboard/settings/audit" },
        { title: "Критерии оценок", url: "#" },
        { title: "Интеграции", url: "#" },
        { title: "Права доступа", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: {
  user: { name: string; email: string; avatar?: string };
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
