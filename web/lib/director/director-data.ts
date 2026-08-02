import type { DirectorDashboardData, DirectorPeriod } from "@/lib/director/types";
import { directorDashboardRepo } from "@/lib/data/registry";

export function parseDirectorPeriod(value: string | null | undefined): DirectorPeriod {
  return directorDashboardRepo.parsePeriod(value);
}

export async function getDirectorDashboard(
  period: DirectorPeriod,
  schoolId?: string | null,
): Promise<DirectorDashboardData> {
  return directorDashboardRepo.getDashboard(period, schoolId);
}
