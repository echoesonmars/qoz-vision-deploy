import type { CameraRecord, CamerasFilterState } from "@/lib/cameras/cameras-types";

export function filterCameras(rows: CameraRecord[], filters: CamerasFilterState): CameraRecord[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.enabledOnly && !row.isEnabled) return false;
    if (filters.organization !== "all") {
      const org = row.organizationName?.trim() ?? "";
      if (org !== filters.organization) return false;
    }
    if (!q) return true;
    const haystack = [
      row.name,
      row.address,
      row.deviceType,
      row.organizationName,
      row.id,
      String(row.index),
      String(row.uniqueChannel),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export type PaginatedCameras<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
};

export function paginateCameras<T>(
  rows: T[],
  page: number,
  pageSize: number,
): PaginatedCameras<T> {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);
  const rangeStart = total === 0 ? 0 : start + 1;
  const rangeEnd = total === 0 ? 0 : start + items.length;
  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
    rangeStart,
    rangeEnd,
  };
}

export function hasActiveCameraFilters(filters: CamerasFilterState): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.organization !== "all" ||
    !filters.enabledOnly
  );
}
