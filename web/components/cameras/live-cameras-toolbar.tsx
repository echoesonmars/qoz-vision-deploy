"use client";

import { MdSearch } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CameraOrganizationFilter, CamerasPageSize } from "@/lib/cameras/cameras-types";

type LiveCamerasToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  organization: CameraOrganizationFilter;
  onOrganizationChange: (value: CameraOrganizationFilter) => void;
  pageSize: CamerasPageSize;
  onPageSizeChange: (value: CamerasPageSize) => void;
  organizations: string[];
};

const PAGE_SIZE_OPTIONS: CamerasPageSize[] = [12, 24, 48];

export function LiveCamerasToolbar({
  search,
  onSearchChange,
  organization,
  onOrganizationChange,
  pageSize,
  onPageSizeChange,
  organizations,
}: LiveCamerasToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-56">
        <MdSearch
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по названию, адресу, организации…"
          className="h-10 pl-10"
        />
      </div>
      <Select value={organization} onValueChange={onOrganizationChange}>
        <SelectTrigger className="h-10 w-full sm:min-w-52 sm:w-64">
          <SelectValue placeholder="Организация" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">Все организации</SelectItem>
          {organizations.map((org) => (
            <SelectItem key={org} value={org}>
              {org}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(pageSize)}
        onValueChange={(v) => onPageSizeChange(Number(v) as CamerasPageSize)}
      >
        <SelectTrigger className="h-10 w-full sm:w-36">
          <SelectValue placeholder="На странице" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size} на странице
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
