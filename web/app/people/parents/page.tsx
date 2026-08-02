import { DashboardInsetHeader } from "@/components/dashboard/dashboard-inset-header";
import { PeopleParentsAccessCard } from "@/components/people/people-parents-access-card";
import { PeopleParentsAppealsCard } from "@/components/people/people-parents-appeals-card";
import { PeopleParentsMappingCard } from "@/components/people/people-parents-mapping-card";
import { PeopleParentsNotificationsCard } from "@/components/people/people-parents-notifications-card";

export default function PeopleParentsPage() {
  return (
    <>
      <DashboardInsetHeader
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Люди", href: "/people/teachers" },
          { label: "Родители" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <PeopleParentsMappingCard />
          <PeopleParentsAccessCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <PeopleParentsNotificationsCard />
          <PeopleParentsAppealsCard />
        </div>
      </div>
    </>
  );
}
