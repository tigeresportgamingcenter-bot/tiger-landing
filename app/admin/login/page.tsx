import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { TigerMark } from "@/components/ui/TigerMark";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const errors: Record<string, string> = {
  config: "Supabase chưa được cấu hình. Vui lòng thêm biến môi trường trước.",
  credentials: "Email hoặc mật khẩu không đúng.",
  permission: "Tài khoản này chưa được cấp quyền quản trị.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
      if (membership) redirect("/admin/dashboard");
    }
  }
  const { error } = await searchParams;
  return <main className="grid min-h-screen place-items-center px-5"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-glow"><div className="flex items-center gap-3"><TigerMark /><div><h1 className="text-xl font-extrabold">Tiger Admin</h1><p className="text-xs text-zinc-500">Quản trị nội dung Phase 2A</p></div></div>{error ? <p className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{errors[error] ?? error}</p> : null}<form action={login} className="mt-7 space-y-4"><label className="block text-sm text-zinc-400">Email<input type="email" name="email" required autoComplete="email" className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-black/50 px-4 text-white outline-none focus:border-tiger-orange" /></label><label className="block text-sm text-zinc-400">Mật khẩu<input type="password" name="password" required autoComplete="current-password" className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-black/50 px-4 text-white outline-none focus:border-tiger-orange" /></label><button className="min-h-12 w-full rounded-lg bg-gradient-to-r from-tiger-red to-tiger-orange font-bold">Đăng nhập</button></form></div></main>;
}
