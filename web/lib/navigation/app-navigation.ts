import type {
  AnalyticsFilters,
  AnalyticsLessonView,
  AnalyticsSection,
  DashboardTab,
} from "@/lib/analytics/types";

export const NAV_FROM_STORAGE_KEY = "qv_nav_from";

export type AppNavigationTarget =
  | {
      to: "dashboard";
      tab?: DashboardTab;
      section?: AnalyticsSection;
      filters?: AnalyticsFilters;
    }
  | { to: "student"; studentId: string; from?: string }
  | { to: "lesson"; lessonId: string; timestamp?: number; from?: string }
  | { to: "incident"; incidentId: string; from?: string }
  | { to: "cameras"; tab?: "live" | "lessons" | "incidents"; from?: string };

export type ParsedDashboardNavigation = {
  tab: DashboardTab;
  section?: AnalyticsSection;
  filters: AnalyticsFilters;
};

const ANALYTICS_SECTIONS = new Set<string>([
  "smart-class",
  "lesson",
  "performance",
  "safety",
  "platform",
]);

function parseTab(value: string | null): DashboardTab {
  return value === "analytics" ? "analytics" : "summary";
}

function parseSection(value: string | null): AnalyticsSection | undefined {
  if (value && ANALYTICS_SECTIONS.has(value)) {
    return value as AnalyticsSection;
  }
  return undefined;
}

function parseView(value: string | null): AnalyticsLessonView | undefined {
  if (value === "actions" || value === "emotions") return value;
  return undefined;
}

export function parseDashboardNavigation(
  params: URLSearchParams,
): ParsedDashboardNavigation {
  return {
    tab: parseTab(params.get("tab")),
    section: parseSection(params.get("section")),
    filters: {
      date: params.get("date") ?? undefined,
      room: params.get("room") ?? undefined,
      lesson: params.get("lesson") ?? undefined,
      classId: params.get("class") ?? undefined,
      studentId: params.get("student") ?? undefined,
      studentName: params.get("studentName") ?? undefined,
      location: params.get("location") ?? undefined,
      view: parseView(params.get("view")),
      subject: params.get("subject") ?? undefined,
    },
  };
}

export function buildNavigationHref(target: AppNavigationTarget): string {
  switch (target.to) {
    case "dashboard": {
      const params = new URLSearchParams();
      if (target.tab) params.set("tab", target.tab);
      if (target.section) params.set("section", target.section);
      const f = target.filters;
      if (f?.date) params.set("date", f.date);
      if (f?.room) params.set("room", f.room);
      if (f?.lesson) params.set("lesson", f.lesson);
      if (f?.classId) params.set("class", f.classId);
      if (f?.studentId) params.set("student", f.studentId);
      if (f?.studentName) params.set("studentName", f.studentName);
      if (f?.location) params.set("location", f.location);
      if (f?.view) params.set("view", f.view);
      if (f?.subject) params.set("subject", f.subject);
      const qs = params.toString();
      return qs ? `/dashboard?${qs}` : "/dashboard";
    }
    case "student": {
      const params = new URLSearchParams();
      params.set("student", target.studentId);
      return `/people/students?${params.toString()}`;
    }
    case "lesson":
      return `/dashboard/cameras/engagement/${target.lessonId}`;
    case "incident":
      return `/dashboard/cameras/engagement?tab=incidents`;
    case "cameras": {
      const params = new URLSearchParams();
      if (target.tab) params.set("tab", target.tab);
      const qs = params.toString();
      return qs
        ? `/dashboard/cameras/engagement?${qs}`
        : "/dashboard/cameras/engagement";
    }
    default:
      return "/dashboard";
  }
}

export function storeNavigationFrom(from: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(NAV_FROM_STORAGE_KEY, from);
}

export function readNavigationFrom(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(NAV_FROM_STORAGE_KEY);
}
