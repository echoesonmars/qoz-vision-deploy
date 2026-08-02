"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdExpandMore } from "react-icons/md";

type DirectorMobileExtrasProps = {
  showAllSections: boolean;
  onToggle: () => void;
};

export function DirectorMobileExtras({ showAllSections, onToggle }: DirectorMobileExtrasProps) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      <Button
        type="button"
        variant="outline"
        className="min-h-11 justify-between"
        onClick={onToggle}
      >
        <span>{showAllSections ? "Свернуть блоки" : "Открыть полный дэшборд"}</span>
        <MdExpandMore
          className={`size-5 transition-transform ${showAllSections ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Button>
      <Button asChild variant="ghost" size="sm" className="min-h-11">
        <Link href="/dashboard/settings/school">Push-уведомления</Link>
      </Button>
    </div>
  );
}
