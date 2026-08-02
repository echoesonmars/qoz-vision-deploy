import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { ChecksArchiveAuditCard } from "@/components/checks/checks-archive-audit-card";
import { ChecksArchiveExamDigitalTwinCard } from "@/components/checks/checks-archive-exam-digital-twin-card";
import { ChecksArchiveExportCard } from "@/components/checks/checks-archive-export-card";
import { ChecksArchiveFiltersCard } from "@/components/checks/checks-archive-filters-card";

export default function ChecksArchivePage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Проверка Sozley", href: "/checks/status" },
          { label: "Архив работ" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ChecksArchiveFiltersCard />
        <ChecksArchiveExamDigitalTwinCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <ChecksArchiveAuditCard />
          <ChecksArchiveExportCard />
        </div>
      </div>
    </>
  );
}
