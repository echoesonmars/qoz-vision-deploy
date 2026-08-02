import { INCIDENTS_BUCKET } from "@/lib/supabase-admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function uploadVideoFromBrowser(
  storagePath: string,
  file: File,
  contentType: string,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(INCIDENTS_BUCKET).upload(storagePath, file, {
    contentType,
    upsert: false,
  });
  if (error) {
    if (/row-level security/i.test(error.message)) {
      throw new Error(
        "Storage RLS: выполните scripts/supabase-storage-rls.sql в Supabase → SQL Editor",
      );
    }
    throw new Error(error.message);
  }
}
