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
import type { CameraRecord } from "@/lib/cameras/cameras-types";
import { setCamerasCache } from "@/lib/cameras/cameras-cache";
import { getPublicBackendBase } from "@/lib/cameras/cameras-registry";

type CamerasContextValue = {
  cameras: CameraRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CamerasContext = createContext<CamerasContextValue | null>(null);

type ApiCamera = CameraRecord & {
  vendor?: string;
  nvrPort?: number;
  username?: string;
  streamProfile?: string;
  transcodeToH264?: boolean;
  rtspUrlOverride?: string | null;
};

export function CamerasProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<CameraRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const base = getPublicBackendBase();
    try {
      const res = await fetch(`${base}/api/cameras`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { cameras?: ApiCamera[] };
      const next = data.cameras ?? [];
      setCameras(next);
      setCamerasCache(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить камеры");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ cameras, loading, error, refresh }),
    [cameras, loading, error, refresh],
  );

  return <CamerasContext.Provider value={value}>{children}</CamerasContext.Provider>;
}

export function useCameras(): CamerasContextValue {
  const ctx = useContext(CamerasContext);
  if (!ctx) {
    throw new Error("useCameras must be used within CamerasProvider");
  }
  return ctx;
}

export function useCamerasOptional(): CamerasContextValue | null {
  return useContext(CamerasContext);
}
