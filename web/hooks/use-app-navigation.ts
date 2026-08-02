"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  buildNavigationHref,
  storeNavigationFrom,
  type AppNavigationTarget,
} from "@/lib/navigation/app-navigation";

export function useAppNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (target: AppNavigationTarget) => {
      if ("from" in target && target.from) {
        storeNavigationFrom(target.from);
      }
      router.push(buildNavigationHref(target));
    },
    [router],
  );

  return { navigate, buildHref: buildNavigationHref };
}
