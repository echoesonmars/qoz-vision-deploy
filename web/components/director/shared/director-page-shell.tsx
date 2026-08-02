import {
  DirectorBreadcrumbs,
  type DirectorBreadcrumbItem,
} from "@/components/director/shared/director-breadcrumbs";
import { DirectorPageHomeLink } from "@/components/director/shared/director-page-home-link";

type DirectorPageShellProps = {
  breadcrumbs: DirectorBreadcrumbItem[];
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function DirectorPageShell({
  breadcrumbs,
  title,
  description,
  children,
  action,
}: DirectorPageShellProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs items={breadcrumbs} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {action}
          <DirectorPageHomeLink />
        </div>
      </div>
      {children}
    </div>
  );
}
