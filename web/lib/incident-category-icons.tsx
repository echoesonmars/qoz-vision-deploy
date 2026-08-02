import type { IconType } from "react-icons";
import {
  MdDirectionsCar,
  MdFireExtinguisher,
  MdGroups,
  MdHotel,
  MdLocalFireDepartment,
  MdNoAccounts,
  MdPersonSearch,
  MdPhoneIphone,
  MdSmokingRooms,
  MdSportsMma,
  MdWarning,
  MdWorkspaces,
} from "react-icons/md";
import type { IncidentCategory } from "@/lib/incidents-types";
import { INCIDENT_CATEGORIES } from "@/lib/incidents-types";

const ICON_BY_CATEGORY: Record<
  (typeof INCIDENT_CATEGORIES)[number],
  IconType
> = {
  fight: MdSportsMma,
  weapon: MdWarning,
  fall: MdNoAccounts,
  smoking: MdSmokingRooms,
  phone_usage: MdPhoneIphone,
  sleep: MdHotel,
  lost_property: MdWorkspaces,
  crowd: MdGroups,
  wanted_person: MdPersonSearch,
  fence_climbing: MdNoAccounts,
  anpr: MdDirectionsCar,
  fire: MdLocalFireDepartment,
  smoke: MdFireExtinguisher,
};

export function incidentCategoryIcon(
  category: IncidentCategory,
): IconType {
  if (category === "pending") return MdWarning;
  if (category === "intruder") return MdNoAccounts;
  const icon = ICON_BY_CATEGORY[category as (typeof INCIDENT_CATEGORIES)[number]];
  return icon ?? MdWarning;
}

export function liveCategoryMarkerTone(category: IncidentCategory): string {
  if (category === "fight" || category === "weapon" || category === "fire") {
    return "bg-destructive border-destructive text-destructive-foreground";
  }
  if (category === "smoking" || category === "fence_climbing") {
    return "bg-amber-500 border-amber-600 text-amber-950";
  }
  if (category === "phone_usage" || category === "sleep") {
    return "bg-violet-600 border-violet-700 text-white";
  }
  if (category === "crowd" || category === "wanted_person") {
    return "bg-blue-600 border-blue-700 text-white";
  }
  return "bg-primary border-primary text-primary-foreground";
}
