"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdClass, MdGroups, MdLightbulbOutline, MdPsychology } from "react-icons/md";

const ACTIONS = [
  { label: "Психологу", href: "/dashboard/director/security/sec-2", icon: MdPsychology },
  { label: "План", href: "/dashboard/director/classes/9b-modo-risk", icon: MdLightbulbOutline },
  { label: "Методсовет", href: "/people/teachers", icon: MdGroups },
  { label: "Открыть класс", href: "/dashboard/director/classes/9b", icon: MdClass },
] as const;

export function DirectorQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 md:hidden">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            asChild
            variant="outline"
            className="min-h-11 justify-start gap-2"
          >
            <Link href={action.href}>
              <Icon className="size-4" aria-hidden />
              {action.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
