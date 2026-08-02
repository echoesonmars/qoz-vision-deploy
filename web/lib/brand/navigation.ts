import { ADM_COPY } from "@/lib/brand/copy";
import type { DashboardBreadcrumbItem } from "@/components/dashboard/dashboard-inset-header";

export function camerasBreadcrumbItems(
  suffix: Omit<DashboardBreadcrumbItem, "label"> & { label?: string },
): DashboardBreadcrumbItem[] {
  return [
    { label: "Главная", href: "/dashboard" },
    { label: ADM_COPY.videoAnalyticsNav, href: "/dashboard/cameras/all" },
    { label: suffix.label ?? "", href: suffix.href },
  ].filter((item) => item.label.length > 0);
}
