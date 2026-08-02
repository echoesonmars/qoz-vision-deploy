"use client";

import { useEffect, useRef, useState } from "react";
import { MdPlayCircleOutline } from "react-icons/md";
import { admMediaBackdropClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type LessonCardPreviewProps = {
  lessonId: string;
  pending?: boolean;
};

export function LessonCardPreview({ lessonId, pending = false }: LessonCardPreviewProps) {
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
        const res = await fetch(`/api/lessons/${lessonId}/signed-url`);
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
  }, [lessonId, shouldLoad]);

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
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        admMediaBackdropClass,
      )}
    >
      {videoUrl && !failed ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity",
            ready ? "opacity-100" : "opacity-0",
          )}
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          {pending ? (
            <span className="text-sm text-slate-300">Анализ видео…</span>
          ) : (
            <MdPlayCircleOutline className="size-14 text-white/80" aria-hidden />
          )}
        </div>
      ) : ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <MdPlayCircleOutline className="size-12 text-white/90 drop-shadow-md" aria-hidden />
        </div>
      ) : null}
    </div>
  );
}
