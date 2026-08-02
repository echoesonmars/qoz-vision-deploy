"use client";

import Link from "next/link";
import { useState } from "react";
import { DirectorBreadcrumbs } from "@/components/director/shared/director-breadcrumbs";
import { DirectorDisclaimer } from "@/components/director/shared/director-disclaimer";
import { Button } from "@/components/ui/button";
import { DirectorMockFeedback } from "@/components/director/shared/director-mock-feedback";
import { Label } from "@/components/ui/label";

export function TeacherRightsClient() {
  const [videoOptOut, setVideoOptOut] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function submitFeedback() {
    setStatusMessage("Обратная связь отправлена");
    setFeedbackText("");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <DirectorBreadcrumbs
        items={[
          { label: "Главный экран", href: "/dashboard" },
          { label: "Права педагогов" },
        ]}
      />
      <h1 className="text-xl font-semibold">Права педагогов (§11.6)</h1>
      <DirectorDisclaimer>
        Педагог может просматривать свои данные, оспаривать рекомендации и отказаться от
        видеоаналитики.
      </DirectorDisclaimer>
      <DirectorMockFeedback message={statusMessage} />
      <div className="max-w-lg space-y-6 rounded-xl bg-muted/30 p-6 ring-1 ring-border/50">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="video-opt-out">Отказ от видеоаналитики</Label>
          <input
            id="video-opt-out"
            type="checkbox"
            checked={videoOptOut}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoOptOut(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback">Обратная связь</Label>
          <textarea
            id="feedback"
            value={feedbackText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackText(e.target.value)}
            placeholder="Вопрос или замечание…"
            rows={4}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
          <Button type="button" size="sm" onClick={submitFeedback}>
            Отправить
          </Button>
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href="/dashboard">На главный экран</Link>
      </Button>
    </div>
  );
}
