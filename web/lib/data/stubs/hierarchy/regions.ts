import { aggregateMetrics, aggregateSchoolMetrics } from "@/lib/hierarchy/aggregate-metrics";
import { REPUBLICAN_CITIES_MOCK } from "@/lib/data/stubs/hierarchy/republican-cities";
import { ZHEZKAZGAN_SCHOOLS } from "@/lib/data/stubs/hierarchy/zhezkazgan";
import type { HierarchyCity, HierarchyMetrics, HierarchyRegion } from "@/lib/hierarchy/types";

function stubCity(
  id: string,
  name: string,
  metrics: HierarchyMetrics,
  districts: HierarchyCity["districts"] = [],
  schools?: HierarchyCity["schools"],
  isActive?: boolean,
): HierarchyCity {
  return { id, name, metrics, districts, schools, isActive };
}

function stubRegion(
  id: string,
  name: string,
  cities: HierarchyCity[],
  isActive?: boolean,
): HierarchyRegion {
  return {
    id,
    name,
    metrics: aggregateMetrics(cities),
    cities,
    isActive,
  };
}

const REPUBLICAN_CITIES = stubRegion(
  "republican-cities",
  "Города республиканского значения",
  REPUBLICAN_CITIES_MOCK,
  false,
);

const ABAY_REGION = stubRegion("abay", "Абайская область", [
  stubCity("semey", "г. Семей", {
    totalSchools: 68,
    totalStudents: 78400,
    attendance: 85.6,
    gpa: 3.98,
    incidentsToday: 3,
  }),
  stubCity("kurchatov", "г. Курчатов", {
    totalSchools: 12,
    totalStudents: 9200,
    attendance: 87.1,
    gpa: 4.02,
    incidentsToday: 0,
  }),
  stubCity("ayagoz", "г. Аягоз", {
    totalSchools: 18,
    totalStudents: 14300,
    attendance: 84.9,
    gpa: 3.92,
    incidentsToday: 1,
  }),
]);

const AKMOLA_REGION = stubRegion("akmola", "Акмолинская область", [
  stubCity("kokshetau", "г. Кокшетау", {
    totalSchools: 54,
    totalStudents: 48200,
    attendance: 86.4,
    gpa: 4.01,
    incidentsToday: 2,
  }),
  stubCity("stepnogorsk", "г. Степногорск", {
    totalSchools: 22,
    totalStudents: 18600,
    attendance: 85.8,
    gpa: 3.96,
    incidentsToday: 1,
  }),
  stubCity("akkol", "г. Акколь", {
    totalSchools: 14,
    totalStudents: 9800,
    attendance: 86.2,
    gpa: 3.94,
    incidentsToday: 0,
  }),
]);

const AKTOBE_REGION = stubRegion("aktobe", "Актюбинская область", [
  stubCity("aktobe", "г. Актобе", {
    totalSchools: 76,
    totalStudents: 89400,
    attendance: 86.2,
    gpa: 4.0,
    incidentsToday: 3,
  }),
  stubCity("khromtau", "г. Хромтау", {
    totalSchools: 16,
    totalStudents: 11200,
    attendance: 85.1,
    gpa: 3.91,
    incidentsToday: 1,
  }),
]);

const ALMATY_OBLAST = stubRegion("almaty-oblast", "Алматинская область", [
  stubCity("taldykorgan", "г. Талдыкорган", {
    totalSchools: 48,
    totalStudents: 52100,
    attendance: 86.7,
    gpa: 4.03,
    incidentsToday: 2,
  }),
  stubCity("kapshagay", "г. Капшагай", {
    totalSchools: 24,
    totalStudents: 28400,
    attendance: 85.4,
    gpa: 3.97,
    incidentsToday: 1,
  }),
  stubCity("tekeli", "г. Текели", {
    totalSchools: 12,
    totalStudents: 8600,
    attendance: 84.8,
    gpa: 3.9,
    incidentsToday: 0,
  }),
]);

const ATYRAU_REGION = stubRegion("atyrau", "Атырауская область", [
  stubCity("atyrau", "г. Атырау", {
    totalSchools: 62,
    totalStudents: 71300,
    attendance: 87.3,
    gpa: 4.06,
    incidentsToday: 2,
  }),
  stubCity("kulsary", "г. Кульсары", {
    totalSchools: 18,
    totalStudents: 15200,
    attendance: 86.0,
    gpa: 3.95,
    incidentsToday: 1,
  }),
]);

const VKO_REGION = stubRegion("vko", "Восточно-Казахстанская область", [
  stubCity("oskemen", "г. Усть-Каменогорск", {
    totalSchools: 58,
    totalStudents: 62400,
    attendance: 86.5,
    gpa: 4.0,
    incidentsToday: 2,
  }),
  stubCity("ridder", "г. Риддер", {
    totalSchools: 16,
    totalStudents: 11800,
    attendance: 85.7,
    gpa: 3.93,
    incidentsToday: 0,
  }),
  stubCity("zaysan", "г. Зайсан", {
    totalSchools: 10,
    totalStudents: 7200,
    attendance: 84.6,
    gpa: 3.88,
    incidentsToday: 0,
  }),
]);

const ZHAMBYL_REGION = stubRegion("zhambyl", "Жамбылская область", [
  stubCity("taraz", "г. Тараз", {
    totalSchools: 72,
    totalStudents: 83600,
    attendance: 86.1,
    gpa: 3.99,
    incidentsToday: 3,
  }),
  stubCity("shu", "г. Шу", {
    totalSchools: 14,
    totalStudents: 10400,
    attendance: 85.3,
    gpa: 3.92,
    incidentsToday: 1,
  }),
]);

const ZKO_REGION = stubRegion("zko", "Западно-Казахстанская область", [
  stubCity("oral", "г. Уральск", {
    totalSchools: 52,
    totalStudents: 56800,
    attendance: 85.9,
    gpa: 3.97,
    incidentsToday: 2,
  }),
  stubCity("aksai", "г. Аксай", {
    totalSchools: 12,
    totalStudents: 9600,
    attendance: 86.4,
    gpa: 4.0,
    incidentsToday: 0,
  }),
]);

const KARAGANDA_REGION = stubRegion("karaganda", "Карагандинская область", [
  stubCity("karaganda", "г. Караганда", {
    totalSchools: 98,
    totalStudents: 112400,
    attendance: 85.8,
    gpa: 3.95,
    incidentsToday: 4,
  }),
  stubCity("temirtau", "г. Темиртау", {
    totalSchools: 28,
    totalStudents: 24600,
    attendance: 84.7,
    gpa: 3.89,
    incidentsToday: 2,
  }),
  stubCity("balkhash", "г. Балхаш", {
    totalSchools: 16,
    totalStudents: 13200,
    attendance: 85.2,
    gpa: 3.91,
    incidentsToday: 1,
  }),
]);

const KOSTANAY_REGION = stubRegion("kostanay", "Костанайская область", [
  stubCity("kostanay", "г. Костанай", {
    totalSchools: 64,
    totalStudents: 59800,
    attendance: 86.3,
    gpa: 4.01,
    incidentsToday: 2,
  }),
  stubCity("rudny", "г. Рудный", {
    totalSchools: 22,
    totalStudents: 19400,
    attendance: 85.6,
    gpa: 3.94,
    incidentsToday: 1,
  }),
  stubCity("lisakovsk", "г. Лисаковск", {
    totalSchools: 14,
    totalStudents: 10200,
    attendance: 85.0,
    gpa: 3.9,
    incidentsToday: 0,
  }),
]);

const KYZYLORDA_REGION = stubRegion("kyzylorda", "Кызылординская область", [
  stubCity("kyzylorda", "г. Кызылорда", {
    totalSchools: 58,
    totalStudents: 67200,
    attendance: 85.5,
    gpa: 3.93,
    incidentsToday: 2,
  }),
  stubCity("baikonur", "г. Байконыр", {
    totalSchools: 8,
    totalStudents: 5400,
    attendance: 87.8,
    gpa: 4.08,
    incidentsToday: 0,
  }),
]);

const MANGYSTAU_REGION = stubRegion("mangystau", "Мангистауская область", [
  stubCity("aktau", "г. Актау", {
    totalSchools: 54,
    totalStudents: 61800,
    attendance: 86.8,
    gpa: 4.02,
    incidentsToday: 2,
  }),
  stubCity("zhanaozen", "г. Жанаозен", {
    totalSchools: 26,
    totalStudents: 28400,
    attendance: 84.9,
    gpa: 3.88,
    incidentsToday: 3,
  }),
]);

const PAVLODAR_REGION = stubRegion("pavlodar", "Павлодарская область", [
  stubCity("pavlodar", "г. Павлодар", {
    totalSchools: 66,
    totalStudents: 70200,
    attendance: 86.0,
    gpa: 3.98,
    incidentsToday: 2,
  }),
  stubCity("ekibastuz", "г. Экибастуз", {
    totalSchools: 32,
    totalStudents: 31800,
    attendance: 85.4,
    gpa: 3.92,
    incidentsToday: 1,
  }),
]);

const SKO_REGION = stubRegion("sko", "Северо-Казахстанская область", [
  stubCity("petropavl", "г. Петропавл", {
    totalSchools: 46,
    totalStudents: 42600,
    attendance: 86.6,
    gpa: 4.0,
    incidentsToday: 1,
  }),
  stubCity("sergeevka", "г. Сергеевка", {
    totalSchools: 10,
    totalStudents: 6800,
    attendance: 85.8,
    gpa: 3.93,
    incidentsToday: 0,
  }),
]);

const TURKESTAN_REGION = stubRegion("turkestan", "Туркестанская область", [
  stubCity("turkistan", "г. Туркестан", {
    totalSchools: 44,
    totalStudents: 51200,
    attendance: 85.7,
    gpa: 3.96,
    incidentsToday: 2,
  }),
  stubCity("kentau", "г. Кентау", {
    totalSchools: 22,
    totalStudents: 21400,
    attendance: 84.8,
    gpa: 3.9,
    incidentsToday: 1,
  }),
  stubCity("shardara", "г. Шардара", {
    totalSchools: 16,
    totalStudents: 13800,
    attendance: 85.1,
    gpa: 3.91,
    incidentsToday: 0,
  }),
]);

const JETISU_REGION = stubRegion("jetisu", "Жетысуская область", [
  stubCity("taldykorgan-jetisu", "г. Талдыкорган", {
    totalSchools: 42,
    totalStudents: 46800,
    attendance: 86.4,
    gpa: 4.0,
    incidentsToday: 1,
  }),
  stubCity("sarkand", "г. Сарканд", {
    totalSchools: 12,
    totalStudents: 9200,
    attendance: 85.6,
    gpa: 3.94,
    incidentsToday: 0,
  }),
]);

const ULYTAU_REGION = stubRegion(
  "ulytau",
  "Улытауская область",
  [
    stubCity(
      "zhezkazgan",
      "г. Жезказган",
      aggregateSchoolMetrics(ZHEZKAZGAN_SCHOOLS),
      [],
      ZHEZKAZGAN_SCHOOLS,
      true,
    ),
    stubCity(
      "satpayev",
      "г. Сатпаев",
      {
        totalSchools: 0,
        totalStudents: 0,
        attendance: 0,
        gpa: 0,
        incidentsToday: 0,
      },
      [],
      [],
      true,
    ),
  ],
  true,
);

export const KAZAKHSTAN_REGIONS: HierarchyRegion[] = [
  REPUBLICAN_CITIES,
  // ALMATY_OBLAST,
  // AKMOLA_REGION,
  // AKTOBE_REGION,
  // ATYRAU_REGION,
  // VKO_REGION,
  // ZHAMBYL_REGION,
  // ZKO_REGION,
  // KARAGANDA_REGION,
  // KOSTANAY_REGION,
  // KYZYLORDA_REGION,
  // MANGYSTAU_REGION,
  // PAVLODAR_REGION,
  // SKO_REGION,
  // TURKESTAN_REGION,
  // ABAY_REGION,
  // JETISU_REGION,
  ULYTAU_REGION,
];

export const PARKED_KAZAKHSTAN_REGIONS: HierarchyRegion[] = [
  ALMATY_OBLAST,
  AKMOLA_REGION,
  AKTOBE_REGION,
  ATYRAU_REGION,
  VKO_REGION,
  ZHAMBYL_REGION,
  ZKO_REGION,
  KARAGANDA_REGION,
  KOSTANAY_REGION,
  KYZYLORDA_REGION,
  MANGYSTAU_REGION,
  PAVLODAR_REGION,
  SKO_REGION,
  TURKESTAN_REGION,
  ABAY_REGION,
  JETISU_REGION,
];

export function listRegions(): HierarchyRegion[] {
  return KAZAKHSTAN_REGIONS;
}

export function listAllCities(): HierarchyCity[] {
  return KAZAKHSTAN_REGIONS.flatMap((region) => region.cities);
}
