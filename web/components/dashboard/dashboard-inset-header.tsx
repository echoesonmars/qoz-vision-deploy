import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type DashboardBreadcrumbItem = {
  label: string;
  href?: string;
};

function normalizeItems(items: DashboardBreadcrumbItem[]) {
  return items.map((item, index) => {
    if (index === 0 && item.href === "/dashboard") {
      return { ...item, label: "Главный экран" };
    }
    return item;
  });
}

export function DashboardInsetHeader({ items }: { items: DashboardBreadcrumbItem[] }) {
  const crumbs = normalizeItems(items);
  const lastIndex = crumbs.length - 1;

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/50 px-4 md:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((item, i) => {
            const isLast = i === lastIndex;
            return (
              <Fragment key={`${item.label}-${i}`}>
                {i > 0 ? <BreadcrumbSeparator className="hidden md:block" /> : null}
                <BreadcrumbItem className={i < lastIndex ? "hidden md:block" : undefined}>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
