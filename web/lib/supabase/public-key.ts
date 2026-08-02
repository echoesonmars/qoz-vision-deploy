export function getSupabasePublicKey(): string | undefined {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (publishable) return publishable;
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}

export function isBrowserSupabaseStorageEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && getSupabasePublicKey());
}
