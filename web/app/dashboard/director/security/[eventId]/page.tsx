import { notFound } from "next/navigation";
import { SecurityEventClient } from "@/components/director/security/security-event-client";
import { directorDetailRepo } from "@/lib/data";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function DirectorSecurityEventPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = directorDetailRepo.getSecurityEvent(eventId);
  if (!event) notFound();
  return <SecurityEventClient event={event} />;
}
