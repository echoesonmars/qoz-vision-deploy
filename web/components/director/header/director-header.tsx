"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdmLogo } from "@/components/brand/adm-logo";
import { DirectorProfileMenu } from "@/components/director/header/director-profile-menu";
import { ADM_COPY } from "@/lib/brand/copy";
import { admHeaderShellClass } from "@/lib/brand/ui-classes";
import { directorDetailRepo } from "@/lib/data";
import { useDirectorLocale } from "@/lib/director/i18n/locale-context";
import type { DirectorLocale } from "@/lib/director/i18n/messages";
import { useDirectorPeriod } from "@/lib/director/period-context";
import { DIRECTOR_PATHS } from "@/lib/director/paths";
import { useSchoolContext } from "@/lib/hierarchy/school-context";
import { listSelectableSchools } from "@/lib/hierarchy/resolvers";
import type { School } from "@/lib/director/types";
import { MdNotificationsNone, MdRefresh } from "react-icons/md";

type DirectorHeaderProps = {
  school: School | undefined;
  lastUpdatedAt: Date | null;
  onRefresh: () => void;
  compact?: boolean;
  notificationCount?: number;
  userRole?: string;
  avatarUrl?: string;
};

const LOCALE_LABELS: Record<DirectorLocale, string> = {
  kk: "ҚАЗ",
  ru: "РУС",
  en: "ENG",
};

export function DirectorHeader({
  school,
  lastUpdatedAt,
  onRefresh,
  compact,
  notificationCount = 0,
  userRole = "Директор",
  avatarUrl,
}: DirectorHeaderProps) {
  const router = useRouter();
  const { period, setPeriod } = useDirectorPeriod();
  const { locale, setLocale, tr } = useDirectorLocale();
  const { schoolId, backHref, setSchoolContext } = useSchoolContext();
  const selectableSchools = listSelectableSchools();
  const now = new Date();

  function handleSchoolChange(nextSchoolId: string) {
    setSchoolContext(nextSchoolId, backHref);
    const params = new URLSearchParams();
    params.set("school", nextSchoolId);
    params.set("back", backHref);
    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <header className={admHeaderShellClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Link href={DIRECTOR_PATHS.home} className="shrink-0">
            <AdmLogo size="sm" />
          </Link>
          <div className="min-w-0">
            <p className="text-heading text-lg font-semibold leading-tight">{ADM_COPY.moduleTitle}</p>
            <p className="text-muted-foreground text-sm">{ADM_COPY.serviceName}</p>
            {!compact ? (
              <p className="text-muted-foreground mt-1 text-xs capitalize">
                {format(now, "EEEE, d MMMM yyyy", { locale: ru })}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Select value={schoolId ?? school?.id ?? ""} onValueChange={handleSchoolChange}>
              <SelectTrigger className="h-9 max-w-[220px]">
                <SelectValue placeholder="Школа" />
              </SelectTrigger>
              <SelectContent>
                {selectableSchools.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locale} onValueChange={(v) => setLocale(v as DirectorLocale)}>
              <SelectTrigger className="h-9 w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LOCALE_LABELS) as DirectorLocale[]).map((l) => (
                  <SelectItem key={l} value={l}>
                    {LOCALE_LABELS[l]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="outline" size="icon" className="relative min-h-11 min-w-11">
              <Link href={DIRECTOR_PATHS.alerts} aria-label="Уведомления">
                <MdNotificationsNone className="size-5" aria-hidden />
                {notificationCount > 0 ? (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 size-5 justify-center p-0 text-[10px]"
                  >
                    {notificationCount}
                  </Badge>
                ) : null}
              </Link>
            </Button>
            <DirectorProfileMenu
              directorName={school?.directorName ?? "Директор"}
              role={userRole}
              avatarUrl={avatarUrl}
            />
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-1 text-sm"
          >
            <MdRefresh className="size-4" aria-hidden />
            {lastUpdatedAt
              ? `${tr("refresh")} ${formatDistanceToNow(lastUpdatedAt, { addSuffix: true, locale: ru })}`
              : "Обновление…"}
          </button>
        </div>
      </div>
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="w-full justify-start sm:w-auto">
          {directorDetailRepo.getDirectorPeriods().map((p) => (
            <TabsTrigger key={p} value={p} className="min-h-11">
              {directorDetailRepo.getPeriodLabels()[p]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
}
