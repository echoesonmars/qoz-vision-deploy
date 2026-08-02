export const ENGAGEMENT_INCIDENT_QUERY_KEY = "incident";

export function buildEngagementListPath(params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `/dashboard/cameras/engagement?${qs}` : "/dashboard/cameras/engagement";
}

export function buildSituationCategoryPath(
  category: string,
  params: URLSearchParams,
): string {
  const base = `/dashboard/cameras/engagement/situations/${encodeURIComponent(category)}`;
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
