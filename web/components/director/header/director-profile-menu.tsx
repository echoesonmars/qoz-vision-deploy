"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdLogout, MdSettings } from "react-icons/md";

type DirectorProfileMenuProps = {
  directorName: string;
  role?: string;
  avatarUrl?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ADM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function DirectorProfileMenu({
  directorName,
  role = "Директор",
  avatarUrl,
}: DirectorProfileMenuProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto gap-2 px-2 py-1.5 font-medium">
          <Avatar className="size-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={directorName} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initialsFromName(directorName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-sm leading-tight">{directorName}</span>
            <span className="text-muted-foreground block text-xs leading-tight">{role}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span>{directorName}</span>
            <span className="text-muted-foreground text-xs font-normal">{role}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings/school")}>
          <MdSettings className="size-4" />
          Настройки школы
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()}>
          <MdLogout className="size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
