"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIRECTOR_ROLE_LABELS } from "@/lib/director/role";
import { useDirectorRole } from "@/lib/director/role-context";
import type { DirectorRole } from "@/lib/director/types";

const ROLES = Object.keys(DIRECTOR_ROLE_LABELS) as DirectorRole[];

export function DirectorRoleSwitcher() {
  const { role, setRole } = useDirectorRole();

  return (
    <div className="space-y-2">
      <Label>Роль (demo)</Label>
      <Select value={role} onValueChange={(v) => setRole(v as DirectorRole)}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {DIRECTOR_ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        Переключение влияет на видимость секций главного экрана (§14).
      </p>
    </div>
  );
}
