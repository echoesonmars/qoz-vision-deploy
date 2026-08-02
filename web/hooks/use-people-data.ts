"use client";

import { useMemo } from "react";
import { peopleRepo } from "@/lib/data";

export function usePeopleStudents() {
  return useMemo(() => peopleRepo.students, []);
}

export function usePeopleTeachers() {
  return useMemo(() => peopleRepo.teachers, []);
}

export function usePeopleParents() {
  return useMemo(() => peopleRepo.parents, []);
}

export function usePeopleClasses() {
  return useMemo(() => peopleRepo.classes, []);
}
