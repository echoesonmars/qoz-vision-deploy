import { NextResponse } from "next/server";
import { directorDashboardRepo } from "@/lib/data/registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = directorDashboardRepo.parsePeriod(searchParams.get("period"));
  const schoolId = searchParams.get("schoolId");
  const data = await directorDashboardRepo.getDashboard(period, schoolId);
  return NextResponse.json(data);
}
