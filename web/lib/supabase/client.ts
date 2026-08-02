import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey } from "@/lib/supabase/public-key";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabasePublicKey();
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and publishable/anon key are not configured");
  }
  return createBrowserClient(url, key);
}
