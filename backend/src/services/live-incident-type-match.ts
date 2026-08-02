import type { IncidentCategoryId } from "../constants/incident-categories.js";
import { normalizeLiveIncidentType } from "./live-incident-normalize.js";

const ALIAS_ENTRIES: { alias: string; category: IncidentCategoryId }[] = [
  { alias: "phone", category: "phone_usage" },
  { alias: "phones", category: "phone_usage" },
  { alias: "phoneusage", category: "phone_usage" },
  { alias: "mobile", category: "phone_usage" },
  { alias: "smartphone", category: "phone_usage" },
  { alias: "sleeping", category: "sleep" },
  { alias: "asleep", category: "sleep" },
  { alias: "nap", category: "sleep" },
  { alias: "fighting", category: "fight" },
  { alias: "brawl", category: "fight" },
  { alias: "weapons", category: "weapon" },
  { alias: "gun", category: "weapon" },
  { alias: "knife", category: "weapon" },
  { alias: "fallen", category: "fall" },
  { alias: "cigarette", category: "smoking" },
  { alias: "flame", category: "fire" },
  { alias: "gathering", category: "crowd" },
  { alias: "lostproperty", category: "lost_property" },
  { alias: "abandoned", category: "lost_property" },
  { alias: "wantedperson", category: "wanted_person" },
  { alias: "fenceclimbing", category: "fence_climbing" },
  { alias: "climbing", category: "fence_climbing" },
  { alias: "license_plate", category: "anpr" },
  { alias: "plate", category: "anpr" },
];

export function liveIncidentTypeMatchers(category: IncidentCategoryId): string[] {
  const matchers = new Set<string>([category]);
  for (const entry of ALIAS_ENTRIES) {
    if (entry.category === category) {
      matchers.add(entry.alias);
    }
  }
  return [...matchers];
}

export function liveIncidentTypeMatchesCategory(
  raw: string,
  category: IncidentCategoryId,
): boolean {
  return normalizeLiveIncidentType(raw) === category;
}
