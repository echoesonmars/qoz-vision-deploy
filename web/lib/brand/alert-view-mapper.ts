import type { DirectorAlert } from "@/lib/director/types";
import {
  ALERT_PRIORITY_LABELS,
  getAlertStatusByPriority,
  type AlertStatusDefinition,
} from "@/lib/brand/alert-status";

export type AdmAlertView = {
  eventTitle: string;
  classLabel: string;
  roomLabel: string;
  occurredAt: string;
  riskLabel: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  responsible: string;
  reactionDeadline: string;
  status: AlertStatusDefinition;
};

const CLASS_PATTERN = /\d+\s*«[А-ЯЁA-Z]»/u;
const ROOM_PATTERN = /(?:каб\.?\s*|кабинет\s*)(\d+)/iu;
const TIME_PATTERN = /\b\d{1,2}:\d{2}\b/u;
const DATE_TIME_PATTERN = /\b\d{1,2}\.\d{1,2}(?:\s+\d{1,2}:\d{2})?\b/u;

function splitContextSegments(context: string): string[] {
  return context
    .split("·")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

function extractClassLabel(segments: string[]): string {
  for (const segment of segments) {
    const match = segment.match(CLASS_PATTERN);
    if (match) return match[0];
  }
  return "—";
}

function extractRoomLabel(segments: string[]): string {
  for (const segment of segments) {
    const match = segment.match(ROOM_PATTERN);
    if (match) return `Каб. ${match[1]}`;
    if (/входная группа/iu.test(segment)) return segment;
  }
  return "—";
}

function extractOccurredAt(segments: string[], fallback: string): string {
  for (const segment of segments) {
    const timeMatch = segment.match(TIME_PATTERN);
    if (timeMatch) return timeMatch[0];
    const dateTimeMatch = segment.match(DATE_TIME_PATTERN);
    if (dateTimeMatch) return dateTimeMatch[0];
  }
  return fallback;
}

function extractDescription(segments: string[]): string {
  if (segments.length === 0) return "—";
  const sourceSegment = segments.find((segment) =>
    /электронный журнал|видеоаналитика|скуд|прогноз|система|мониторинг/iu.test(segment),
  );
  if (sourceSegment) return sourceSegment;
  return segments[segments.length - 1] ?? "—";
}

export function mapDirectorAlertToView(alert: DirectorAlert): AdmAlertView {
  const segments = splitContextSegments(alert.context);
  const status = getAlertStatusByPriority(alert.priority);

  return {
    eventTitle: alert.title,
    classLabel: extractClassLabel(segments),
    roomLabel: extractRoomLabel(segments),
    occurredAt: extractOccurredAt(segments, alert.reactionDeadline),
    riskLabel: ALERT_PRIORITY_LABELS[alert.priority],
    description: extractDescription(segments),
    actionLabel: alert.actionLabel,
    actionHref: alert.href,
    responsible: alert.responsible,
    reactionDeadline: alert.reactionDeadline,
    status,
  };
}
