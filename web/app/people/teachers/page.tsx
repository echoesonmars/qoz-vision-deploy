import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { PeopleTeachersCopilotCard } from "@/components/people/people-teachers-copilot-card";
import { PeopleTeachersDirectoryCard } from "@/components/people/people-teachers-directory-card";
import { PeopleTeachersKpiCard } from "@/components/people/people-teachers-kpi-card";
import { PeopleTeachersLoadCard } from "@/components/people/people-teachers-load-card";

export default function PeopleTeachersPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Люди", href: "/people/teachers" },
          { label: "Учителя" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <PeopleTeachersDirectoryCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <PeopleTeachersKpiCard />
          <PeopleTeachersLoadCard />
        </div>
        <PeopleTeachersCopilotCard />
      </div>
    </>
  );
}
