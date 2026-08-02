"use client";

import { useEffect, useState, type RefObject } from "react";

export function useInView(
  ref: RefObject<HTMLElement | null>,
  watchKey?: string | number | null,
  rootMargin = "100px",
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, watchKey]);

  return inView;
}
