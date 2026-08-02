"use client";

import { useEffect, useRef, useState } from "react";
import { parseStreamMessage, type StreamOverlayBoxNormalized } from "@/lib/cameras/stream-protocol";

export function useStreamOverlays(enabled: boolean) {
  const [connected, setConnected] = useState(false);
  const [boxes, setBoxes] = useState<StreamOverlayBoxNormalized[]>([]);
  const [caption, setCaption] = useState<string | undefined>();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      setBoxes([]);
      setCaption(undefined);
      setConnected(false);
      return;
    }
    const url = process.env.NEXT_PUBLIC_STREAM_WS_URL;
    if (url) {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      ws.onmessage = (ev) => {
        const msg = parseStreamMessage(String(ev.data));
        if (msg) {
          setBoxes(msg.boxes);
          setCaption(msg.caption);
        }
      };
      return () => {
        ws.close();
        wsRef.current = null;
      };
    }
    setConnected(true);
    const t = setInterval(() => {
      setBoxes([
        {
          left: 0.12 + Math.sin(Date.now() / 900) * 0.04,
          top: 0.2,
          width: 0.22,
          height: 0.18,
          label: "",
        },
      ]);
      setCaption("Демо: координаты без бэкенда Railway");
    }, 400);
    return () => clearInterval(t);
  }, [enabled]);

  return { connected, boxes, caption, hasBackend: Boolean(process.env.NEXT_PUBLIC_STREAM_WS_URL) };
}
