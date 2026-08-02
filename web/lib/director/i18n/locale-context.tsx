"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DIRECTOR_LOCALE_STORAGE_KEY,
  type DirectorLocale,
  t,
} from "@/lib/director/i18n/messages";

type DirectorLocaleContextValue = {
  locale: DirectorLocale;
  setLocale: (locale: DirectorLocale) => void;
  tr: (key: string) => string;
};

const DirectorLocaleContext = createContext<DirectorLocaleContextValue | null>(null);

function readLocale(): DirectorLocale {
  if (typeof window === "undefined") return "kk";
  const raw = window.localStorage.getItem(DIRECTOR_LOCALE_STORAGE_KEY);
  if (raw === "kk" || raw === "ru" || raw === "en") return raw;
  return "kk";
}

export function DirectorLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<DirectorLocale>(readLocale);

  const setLocale = useCallback((next: DirectorLocale) => {
    setLocaleState(next);
    window.localStorage.setItem(DIRECTOR_LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      tr: (key: string) => t(locale, key),
    }),
    [locale, setLocale],
  );

  return (
    <DirectorLocaleContext.Provider value={value}>
      {children}
    </DirectorLocaleContext.Provider>
  );
}

export function useDirectorLocale() {
  const ctx = useContext(DirectorLocaleContext);
  if (!ctx) {
    return {
      locale: "ru" as DirectorLocale,
      setLocale: () => {},
      tr: (key: string) => t("ru", key),
    };
  }
  return ctx;
}
