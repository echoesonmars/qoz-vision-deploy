export const DIRECTOR_SECTION_ANCHORS = {
  today: "today",
  attention: "attention",
  quality: "quality",
  sozley: "sozley",
  lessons: "lessons",
  security: "security",
  teachers: "teachers",
  infrastructure: "infrastructure",
  extras: "extras",
} as const;

export type DirectorSectionAnchor =
  (typeof DIRECTOR_SECTION_ANCHORS)[keyof typeof DIRECTOR_SECTION_ANCHORS];
