import type { DirectorRole } from "@/lib/director/types";

export const DIRECTOR_ROLE_STORAGE_KEY = "qv_director_role";

export const DIRECTOR_ROLE_LABELS: Record<DirectorRole, string> = {
  director: "Директор",
  deputy: "Завуч",
  methodist: "Методист",
  teacher: "Учитель",
  psychologist: "Психолог",
  uo: "УО",
};

export function getDefaultDirectorRole(): DirectorRole {
  return "director";
}

export function isDirectorRole(role: DirectorRole): boolean {
  return role === "director" || role === "deputy";
}
