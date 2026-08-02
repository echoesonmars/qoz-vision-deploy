import Link from "next/link";
import { AdmLogo } from "@/components/brand/adm-logo";
import { ADM_COPY } from "@/lib/brand/copy";
import { admPageClass } from "@/lib/brand/ui-classes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className={cn(admPageClass, "flex flex-col items-center justify-center gap-6 p-6")}>
      <AdmLogo size="lg" priority />
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-heading text-xl font-semibold">Страница не найдена</h1>
        <p className="text-muted-foreground text-sm">
          Запрашиваемый раздел {ADM_COPY.moduleTitle} недоступен или был перемещён.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">В панель управления</Link>
      </Button>
    </div>
  );
}
