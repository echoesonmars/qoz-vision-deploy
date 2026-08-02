"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checksCardHeader, checksCardInteractive, summaryKicker } from "@/components/dashboard/summary-card-shell";
import { ConnectionStatus } from "@/components/cameras/connection-status";
import { LiveCanvasContainer } from "@/components/cameras/live-canvas-container";
import { StreamOverlay } from "@/components/cameras/stream-overlay";
import { useStreamOverlays } from "@/lib/cameras/use-stream-overlays";
import { MdSmartDisplay } from "react-icons/md";

export function LiveDemoWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { connected, boxes, caption, hasBackend } = useStreamOverlays(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        el.srcObject = stream;
      } catch {
        setCameraError("Камера недоступна.");
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (el) el.srcObject = null;
    };
  }, []);

  return (
    <Card className={checksCardInteractive}>
      <CardHeader className={checksCardHeader}>
        <p className={summaryKicker}>
          <MdSmartDisplay className="mr-1 inline size-4 align-text-bottom text-primary" aria-hidden />
          Live
        </p>
        <CardTitle className="text-lg font-semibold">Мини-окно стрима</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Та же логика оверлея, что на странице «Прямой эфир».
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <ConnectionStatus
          connected={connected}
          label={hasBackend ? "WS прокси" : "Демо"}
        />
        {cameraError ? <p className="text-muted-foreground text-xs">{cameraError}</p> : null}
        <LiveCanvasContainer videoRef={videoRef}>
          <StreamOverlay boxes={boxes} />
        </LiveCanvasContainer>
        {caption ? <p className="text-muted-foreground text-xs">{caption}</p> : null}
      </CardContent>
    </Card>
  );
}
