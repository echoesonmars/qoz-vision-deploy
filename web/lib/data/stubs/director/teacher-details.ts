import { mockTeacherRecommendations } from "@/lib/data/stubs/director/teacher-recommendations";

export function getTeacherDetail(teacherId: string) {
  const rec = mockTeacherRecommendations.find((t) => t.teacherId === teacherId);
  if (!rec) return null;
  return {
    ...rec,
    rights: {
      canViewOwnData: true,
      canDispute: true,
      canOptOutVideo: true,
      videoOptOut: false,
    },
    metrics: {
      engagementPercent: rec.category === "method_support" ? 58 : 74,
      sorSochDelta: rec.category === "mentor_candidate" ? 3.2 : -0.4,
      weeklyHours: rec.category === "overload" ? 32 : 24,
    },
  };
}
