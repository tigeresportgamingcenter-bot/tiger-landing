function isPlaceholder(value: string) {
  return /YOUR_|YOUR_PROJECT|PUBLISHABLE_KEY/i.test(value);
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" && parsedUrl.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !isSupabaseConfigured()) throw new Error("Supabase chưa được cấu hình hợp lệ.");
  return { url, key };
}
