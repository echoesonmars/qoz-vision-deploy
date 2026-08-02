import type { HierarchyMetrics, HierarchySchool } from "@/lib/hierarchy/types";

export function aggregateMetrics(items: { metrics: HierarchyMetrics }[]): HierarchyMetrics {
  if (items.length === 0) {
    return {
      totalSchools: 0,
      totalStudents: 0,
      attendance: 0,
      gpa: 0,
      incidentsToday: 0,
    };
  }

  const totalSchools = items.reduce((sum, item) => sum + item.metrics.totalSchools, 0);
  const totalStudents = items.reduce((sum, item) => sum + item.metrics.totalStudents, 0);
  const incidentsToday = items.reduce((sum, item) => sum + item.metrics.incidentsToday, 0);
  const attendance =
    totalStudents > 0
      ? items.reduce((sum, item) => sum + item.metrics.attendance * item.metrics.totalStudents, 0) /
        totalStudents
      : 0;
  const gpa =
    totalSchools > 0
      ? items.reduce((sum, item) => sum + item.metrics.gpa * item.metrics.totalSchools, 0) /
        totalSchools
      : 0;

  return {
    totalSchools,
    totalStudents,
    attendance: Math.round(attendance * 10) / 10,
    gpa: Math.round(gpa * 100) / 100,
    incidentsToday,
  };
}

const EMPTY_METRICS: HierarchyMetrics = {
  totalSchools: 0,
  totalStudents: 0,
  attendance: 0,
  gpa: 0,
  incidentsToday: 0,
};

export function aggregateSchoolMetrics(schools: HierarchySchool[]): HierarchyMetrics {
  if (schools.length === 0) {
    return EMPTY_METRICS;
  }

  const totalSchools = schools.length;
  const totalStudents = schools.reduce((sum, school) => sum + school.students, 0);
  const attendance =
    schools.reduce((sum, school) => sum + school.attendance * school.students, 0) / totalStudents;

  return {
    totalSchools,
    totalStudents,
    attendance: Math.round(attendance * 10) / 10,
    gpa: 3.95,
    incidentsToday: 0,
  };
}
