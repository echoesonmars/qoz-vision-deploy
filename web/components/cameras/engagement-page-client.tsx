"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EngagementFleetSituations } from "@/components/cameras/engagement-fleet-situations";
import { EngagementLiveGrid } from "@/components/cameras/engagement-live-grid";
import { IncidentsPageClient } from "@/components/cameras/incidents-page-client";
import { LessonsPageClient } from "@/components/cameras/lessons-page-client";
import { ENGAGEMENT_INCIDENT_QUERY_KEY } from "@/lib/cameras/engagement-incident-url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfrastructureStatus } from "@/lib/cameras/use-infrastructure-status";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TABS = ["live", "lessons", "incidents"] as const;
type EngagementTab = (typeof TABS)[number];

const TAB_LABELS: Record<EngagementTab, string> = {
  live: "Live сейчас",
  lessons: "Архив уроков",
  incidents: "Журнал инцидентов",
};

function parseTab(value: string | null): EngagementTab {
  if (value && (TABS as readonly string[]).includes(value)) return value as EngagementTab;
  return "live";
}

export function EngagementPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));
  const { api, loading } = useInfrastructureStatus();

  const setTab = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    if (next !== "incidents") {
      params.delete(ENGAGEMENT_INCIDENT_QUERY_KEY);
    }
    router.replace(`/dashboard/cameras/engagement?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex flex-col gap-4">
      <EngagementFleetSituations />
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard?tab=analytics&section=lesson">Поведение класса</Link>
        </Button>
      </div>
      <TabsList className="w-full justify-start sm:w-auto">
        {TABS.map((tabId) => (
          <TabsTrigger key={tabId} value={tabId}>
            {TAB_LABELS[tabId]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="live" className="mt-0 flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Только камеры с включённым мониторингом (как в «Прямой эфир»). Откройте карточку для логов и AI-анализа.
        </p>
        <EngagementLiveGrid api={api} loading={loading} />
      </TabsContent>
      <TabsContent value="lessons" className="mt-0">
        <LessonsPageClient />
      </TabsContent>
      <TabsContent value="incidents" className="mt-0">
        <IncidentsPageClient />
      </TabsContent>
    </Tabs>
  );
}
