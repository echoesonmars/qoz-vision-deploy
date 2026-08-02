"use client";

import Link from "next/link";
import { AdmLogo } from "@/components/brand/adm-logo";
import { ADM_COPY } from "@/lib/brand/copy";
import { admPageClass } from "@/lib/brand/ui-classes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CamerasErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CamerasError({ reset }: CamerasErrorProps) {
  return (
    <div className={cn(admPageClass, "flex flex-col items-center justify-center gap-6 p-6")}>
      <AdmLogo size="lg" priority />
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-heading text-xl font-semibold">Ошибка модуля</h1>
        <p className="text-muted-foreground text-sm">
          Не удалось загрузить раздел {ADM_COPY.moduleTitle.toLowerCase()}.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          Повторить
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/cameras/all">К списку камер</Link>
        </Button>
      </div>
    </div>
  );
}
