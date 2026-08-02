"use client";

import { useEffect, useRef, useState } from "react";
import { incidentPreviewTone } from "@/lib/incidents-display";
import type { IncidentRow } from "@/lib/incidents-types";
import { cn } from "@/lib/utils";
import { MdVideocam } from "react-icons/md";

type IncidentCardPreviewProps = {
  incidentId: string;
  category: IncidentRow["category"];
  processing?: boolean;
};

export function IncidentCardPreview({
  incidentId,
  category,
  processing = false,
}: IncidentCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    setReady(false);
    setFailed(false);
    setVideoUrl(null);
    (async () => {
      try {
        const res = await fetch(`/api/incidents/${incidentId}/signed-url`);
        const data = (await res.json()) as { url?: string };
        if (!cancelled && res.ok && data.url) {
          setVideoUrl(data.url);
        } else if (!cancelled) {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [incidentId, shouldLoad]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoUrl) return;
    el.src = videoUrl;
    const onLoaded = () => {
      setReady(true);
      el.currentTime = 0.1;
    };
    const onError = () => setFailed(true);
    el.addEventListener("loadeddata", onLoaded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("loadeddata", onLoaded);
      el.removeEventListener("error", onError);
      el.removeAttribute("src");
      el.load();
    };
  }, [videoUrl]);

  const showFallback = failed || !ready;

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted"
    >
      {videoUrl && !failed ? (
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover transition-opacity",
            ready ? "opacity-100" : "opacity-0",
          )}
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      {showFallback ? (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-b",
            incidentPreviewTone(category),
          )}
        >
          <MdVideocam className="size-12 text-white/40" aria-hidden />
        </div>
      ) : null}
      {processing ? (
        <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-center text-xs font-medium text-white">
          Обработка видео…
        </div>
      ) : null}
    </div>
  );
}
