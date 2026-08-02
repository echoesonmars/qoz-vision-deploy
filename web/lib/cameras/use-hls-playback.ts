"use client";

import Hls from "hls.js";
import { useEffect, useState, type RefObject } from "react";

export type HlsPlaybackStatus = "idle" | "loading" | "playing" | "error";

export function useHlsPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  m3u8Url: string | null,
) {
  const [status, setStatus] = useState<HlsPlaybackStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    if (!m3u8Url) {
      setStatus("idle");
      setErrorMessage(undefined);
      return;
    }

    let cancelled = false;
    let attached = false;
    let hls: Hls | null = null;
    let video: HTMLVideoElement | null = null;

    const onPlaying = () => {
      if (!cancelled) setStatus("playing");
    };

    const tryPlay = () => {
      video?.play().catch(() => {});
    };

    const cleanup = () => {
      if (!video) return;
      video.removeEventListener("playing", onPlaying);
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.removeAttribute("src");
      video.load();
    };

    const attach = () => {
      if (cancelled || attached) return;
      video = videoRef.current;
      if (!video) {
        requestAnimationFrame(attach);
        return;
      }
      attached = true;

      setStatus("loading");
      setErrorMessage(undefined);
      video.addEventListener("playing", onPlaying);

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(m3u8Url);
        hls.attachMedia(video);

        const onManifestParsed = () => tryPlay();
        hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);

        const onError = (_event: string, data: { fatal?: boolean }) => {
          if (!data.fatal || cancelled) return;
          setStatus("error");
          setErrorMessage("Не удалось загрузить поток");
          hls?.destroy();
          hls = null;
        };
        hls.on(Hls.Events.ERROR, onError);
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = m3u8Url;
        video.addEventListener("loadedmetadata", tryPlay, { once: true });
        video.addEventListener(
          "error",
          () => {
            if (!cancelled) {
              setStatus("error");
              setErrorMessage("Не удалось загрузить поток");
            }
          },
          { once: true },
        );
        return;
      }

      setStatus("error");
      setErrorMessage("Браузер не поддерживает HLS");
    };

    attach();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [videoRef, m3u8Url]);

  return { status, errorMessage };
}
