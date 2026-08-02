import type { DirectorPeriod } from "@/lib/director/types";
import type { IDirectorDetailRepository } from "@/lib/data/contracts";
import { buildAcademicQualityBlock } from "@/lib/data/stubs/director/academic-quality";
import { buildDirectorAlerts, sortAlertsByPriority } from "@/lib/data/stubs/director/alerts";
import { getAttendanceByClass } from "@/lib/data/stubs/director/attendance";
import { benchmarkExtendedRows, buildBenchmarksBlock } from "@/lib/data/stubs/director/benchmarks";
import { getClassDetail } from "@/lib/data/stubs/director/class-details";
import { buildDirectorTasks } from "@/lib/data/stubs/director/director-tasks";
import { entForecastMock, modoForecastMock } from "@/lib/data/stubs/director/forecasts";
import { mockRooms } from "@/lib/data/stubs/director/infrastructure";
import { modoRisk9b } from "@/lib/data/stubs/director/modo-risk-9b";
import {
  DEFAULT_DIRECTOR_PERIOD,
  DIRECTOR_PERIOD_LABELS,
  DIRECTOR_PERIODS,
  getPeriodScale,
} from "@/lib/data/stubs/director/periods";
import { ATTENDANCE_THRESHOLD_PERCENT } from "@/lib/data/stubs/director/attendance";
import { ROOM_STATUS_LABELS, getRoomDetail } from "@/lib/data/stubs/director/room-details";
import { getRiskGroupStudents } from "@/lib/data/stubs/director/risk-group";
import {
  getSecurityEvent,
  mockMonitoringZones,
  mockSecurityAuditLog,
} from "@/lib/data/stubs/director/security-events";
import { getStudentDetail } from "@/lib/data/stubs/director/student-details";
import { getTeacherDetail } from "@/lib/data/stubs/director/teacher-details";
import { ROUTINE_OPERATIONS_TOTAL } from "@/lib/data/stubs/director/teacher-load";
import { getTopicDetail } from "@/lib/data/stubs/director/topic-details";
import { mockMapIncidentPins } from "@/lib/data/stubs/director/zones";
import { directorActivityFeed } from "@/lib/data/stubs/director/activity";

export class MockDirectorDetailRepository implements IDirectorDetailRepository {
  getClassDetail(classId: string) {
    return getClassDetail(classId);
  }

  getStudentDetail(studentId: string) {
    return getStudentDetail(studentId);
  }

  getTeacherDetail(teacherId: string) {
    return getTeacherDetail(teacherId);
  }

  getRoomDetail(roomId: string) {
    return getRoomDetail(roomId);
  }

  getTopicDetail(topicId: string) {
    return getTopicDetail(topicId);
  }

  getSecurityEvent(eventId: string) {
    return getSecurityEvent(eventId);
  }

  getAttendanceByClass(period: DirectorPeriod) {
    return getAttendanceByClass(period);
  }

  getRiskGroupStudents(period: DirectorPeriod) {
    return getRiskGroupStudents(period);
  }

  getModoRisk9b() {
    return modoRisk9b;
  }

  getEntForecast() {
    return entForecastMock;
  }

  getModoForecast() {
    return modoForecastMock;
  }

  getBenchmarkRows() {
    return benchmarkExtendedRows;
  }

  getBenchmarksBlock(period: DirectorPeriod) {
    return buildBenchmarksBlock(period);
  }

  getDirectorTasks(period: DirectorPeriod) {
    return buildDirectorTasks(period);
  }

  getDecliningClasses(period: DirectorPeriod) {
    return buildAcademicQualityBlock(period);
  }

  getRooms() {
    return mockRooms;
  }

  getMonitoringZones() {
    return mockMonitoringZones;
  }

  getMapIncidentPins() {
    return mockMapIncidentPins;
  }

  getActivityFeed() {
    return directorActivityFeed;
  }

  getPeriodLabels() {
    return DIRECTOR_PERIOD_LABELS;
  }

  getDefaultPeriod() {
    return DEFAULT_DIRECTOR_PERIOD;
  }

  getDirectorPeriods() {
    return DIRECTOR_PERIODS;
  }

  getPeriodScale(period: DirectorPeriod) {
    return getPeriodScale(period);
  }

  getSecurityAuditLog() {
    return mockSecurityAuditLog;
  }

  getAttendanceThreshold() {
    return ATTENDANCE_THRESHOLD_PERCENT;
  }

  getRoutineOperationsTotal() {
    return ROUTINE_OPERATIONS_TOTAL;
  }

  getRoomStatusLabels() {
    return ROOM_STATUS_LABELS;
  }

  getSortedAlerts(period: DirectorPeriod) {
    return sortAlertsByPriority(buildDirectorAlerts(period));
  }
}
