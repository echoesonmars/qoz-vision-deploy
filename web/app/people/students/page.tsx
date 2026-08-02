import { Suspense } from "react";
import { AdmLoadingScreen } from "@/components/brand/adm-loading-screen";
import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { PeopleStudentsView } from "@/components/people/people-students-view";

export default function PeopleStudentsPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Люди", href: "/people/teachers" },
          { label: "Ученики" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Suspense fallback={<AdmLoadingScreen variant="inline" />}>
          <PeopleStudentsView />
        </Suspense>
      </div>
    </>
  );
}
