import { notFound } from "next/navigation";
import { TeacherDetailClient } from "@/components/director/teachers/teacher-detail-client";
import { directorDetailRepo } from "@/lib/data";

type PageProps = {
  params: Promise<{ teacherId: string }>;
};

export default async function DirectorTeacherPage({ params }: PageProps) {
  const { teacherId } = await params;
  const teacher = directorDetailRepo.getTeacherDetail(teacherId);
  if (!teacher) notFound();
  return <TeacherDetailClient teacher={teacher} />;
}
