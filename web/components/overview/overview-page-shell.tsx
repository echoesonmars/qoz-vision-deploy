import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import {
  DirectorBreadcrumbs,
  type DirectorBreadcrumbItem,
} from "@/components/director/shared/director-breadcrumbs";
import { AdmLogo } from "@/components/brand/adm-logo";
import { Button } from "@/components/ui/button";

type OverviewPageShellProps = {
  breadcrumbs: DirectorBreadcrumbItem[];
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
};

export function OverviewPageShell({
  breadcrumbs,
  title,
  description,
  backHref,
  backLabel = "Назад",
  children,
}: OverviewPageShellProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border/50 pb-4">
        <div className="min-w-0 flex-1">
          <DirectorBreadcrumbs items={breadcrumbs} />
        </div>
        {backHref ? (
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={backHref}>
              <MdArrowBack className="size-4" aria-hidden />
              {backLabel}
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>
          ) : null}
        </div>
        <AdmLogo size="xl" priority />
      </div>
      {children}
    </div>
  );
}
