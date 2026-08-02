import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { PeopleClassesCameraCard } from "@/components/people/people-classes-camera-card";
import { PeopleClassesHierarchyCard } from "@/components/people/people-classes-hierarchy-card";
import { PeopleClassesLedgerCard } from "@/components/people/people-classes-ledger-card";
import { PeopleClassesPerformanceCard } from "@/components/people/people-classes-performance-card";

export default function PeopleClassesPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Люди", href: "/people/teachers" },
          { label: "Классы" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <PeopleClassesHierarchyCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <PeopleClassesPerformanceCard />
          <PeopleClassesCameraCard />
        </div>
        <PeopleClassesLedgerCard />
      </div>
    </>
  );
}
