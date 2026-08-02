import { redirect } from "next/navigation";
import { OVERVIEW_PATHS } from "@/lib/hierarchy/paths";

export default function DirectorUoOverviewPage() {
  redirect(OVERVIEW_PATHS.district("republican-cities", "almaty", "bostandyk"));
}
