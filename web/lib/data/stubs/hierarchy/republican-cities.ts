import type { HierarchyCity, HierarchyDistrict, HierarchyMetrics } from "@/lib/hierarchy/types";

const ZERO_METRICS: HierarchyMetrics = {
  totalSchools: 0,
  totalStudents: 0,
  attendance: 0,
  gpa: 0,
  incidentsToday: 0,
};

function createInactiveDistricts(
  entries: { id: string; name: string }[],
): HierarchyDistrict[] {
  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    metrics: ZERO_METRICS,
    schools: [],
    isActive: false,
  }));
}

const ALMATY_DISTRICT_ENTRIES = [
  { id: "alatau", name: "Алатауский район" },
  { id: "almaly", name: "Алмалинский район" },
  { id: "auezov", name: "Ауэзовский район" },
  { id: "bostandyk", name: "Бостандыкский район" },
  { id: "zhetysu", name: "Жетысуский район" },
  { id: "medeu", name: "Медеуский район" },
  { id: "nauryzbay", name: "Наурызбайский район" },
  { id: "turksib", name: "Турксибский район" },
] as const;

const ASTANA_DISTRICT_ENTRIES = [
  { id: "esil", name: "Есильский район" },
  { id: "saryarka", name: "Сарыаркинский район" },
  { id: "almaty-district", name: "Алматинский район" },
  { id: "baikonur", name: "Байконырский район" },
  { id: "nura", name: "Нураский район" },
] as const;

const SHYMKENT_DISTRICT_ENTRIES = [
  { id: "abay", name: "Абайский район" },
  { id: "al-farabi", name: "Аль-Фарабийский район" },
  { id: "enbekshi", name: "Енбекшинский район" },
  { id: "karatau", name: "Каратауский район" },
] as const;

export const REPUBLICAN_CITIES_MOCK: HierarchyCity[] = [
  {
    id: "almaty",
    name: "г. Алматы",
    metrics: ZERO_METRICS,
    districts: createInactiveDistricts([...ALMATY_DISTRICT_ENTRIES]),
  },
  {
    id: "astana",
    name: "г. Астана",
    metrics: ZERO_METRICS,
    districts: createInactiveDistricts([...ASTANA_DISTRICT_ENTRIES]),
  },
  {
    id: "shymkent",
    name: "г. Шымкент",
    metrics: ZERO_METRICS,
    districts: createInactiveDistricts([...SHYMKENT_DISTRICT_ENTRIES]),
  },
];
