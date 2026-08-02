"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_MAX = Math.max(
  1,
  Number.parseInt(process.env.NEXT_PUBLIC_HLS_PREVIEW_MAX ?? "4", 10) || 4,
);

type SlotCtx = {
  requestSlot: (id: string) => boolean;
  releaseSlot: (id: string) => void;
  maxSlots: number;
};

const HlsPreviewSlotContext = createContext<SlotCtx | null>(null);

export function HlsPreviewSlotProvider({
  children,
  maxSlots = DEFAULT_MAX,
}: {
  children: ReactNode;
  maxSlots?: number;
}) {
  const activeRef = useMemo(() => new Set<string>(), []);
  const [, bump] = useState(0);

  const requestSlot = useCallback(
    (id: string) => {
      if (activeRef.has(id)) return true;
      if (activeRef.size < maxSlots) {
        activeRef.add(id);
        bump((n) => n + 1);
        return true;
      }
      return false;
    },
    [activeRef, maxSlots],
  );

  const releaseSlot = useCallback(
    (id: string) => {
      if (activeRef.delete(id)) bump((n) => n + 1);
    },
    [activeRef],
  );

  const value = useMemo(
    () => ({ requestSlot, releaseSlot, maxSlots }),
    [requestSlot, releaseSlot, maxSlots],
  );

  return (
    <HlsPreviewSlotContext.Provider value={value}>{children}</HlsPreviewSlotContext.Provider>
  );
}

export function useHlsPreviewSlot(id: string, inView: boolean): boolean {
  const ctx = useContext(HlsPreviewSlotContext);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (!ctx) {
      setGranted(inView);
      return;
    }
    if (!inView) {
      ctx.releaseSlot(id);
      setGranted(false);
      return;
    }
    const ok = ctx.requestSlot(id);
    setGranted(ok);
    return () => {
      ctx.releaseSlot(id);
    };
  }, [ctx, id, inView]);

  if (!ctx) return inView;
  return inView && granted;
}

export function useHlsPreviewMaxSlots(): number {
  const ctx = useContext(HlsPreviewSlotContext);
  return ctx?.maxSlots ?? DEFAULT_MAX;
}
