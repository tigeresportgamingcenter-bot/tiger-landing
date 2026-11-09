import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { adminButton, adminInput, adminLabel } from "@/components/admin/styles";
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
  return (
    <main className="grid min-h-screen place-items-center bg-ground px-4 py-10">
      <div className="w-full max-w-md">
        <div className="neon-box rounded-xl bg-panel p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <TigerMark />
            <div>
              <h1 className="font-display text-4xl uppercase leading-none text-white">Tiger Admin</h1>
              <p className="mt-1 text-base text-zinc-300">Quản trị nội dung website</p>
            </div>
          </div>
          {error ? <p role="alert" className="mt-6 rounded-lg bg-red-500/15 px-4 py-3 text-base text-red-200">{errors[error] ?? error}</p> : null}
          <form action={login} className="mt-7 grid gap-5">
            <label className={`${adminLabel} text-base`}>Email
              <input type="email" name="email" required autoComplete="email" className={`${adminInput} mt-2`} />
            </label>
            <label className={`${adminLabel} text-base`}>Mật khẩu
              <input type="password" name="password" required autoComplete="current-password" className={`${adminInput} mt-2`} />
            </label>
            <button className={adminButton}>Đăng nhập</button>
          </form>
        </div>
        <p className="mt-5 text-center text-base"><Link href="/" className="text-zinc-300 underline hover:text-white">Về trang chủ Tiger Esports</Link></p>
      </div>
    </main>
  );
}
