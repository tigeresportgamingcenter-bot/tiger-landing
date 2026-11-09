import { saveLeaderboardBulk } from "@/app/admin/actions";
import { adminButton, adminInput, adminLabel } from "./styles";

export function LeaderboardQuickEntry({ branches, returnTo }: { branches: Array<{ slug: string; name: string }>; returnTo: string }) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
  return (
    <details open className="rounded-xl bg-panel p-5 sm:p-6">
      <summary className="cursor-pointer py-1 font-display text-3xl uppercase text-white">Nhập nhanh top 5</summary>
      <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-300">Chọn cơ sở và kỳ, điền tối đa 5 người rồi lưu một lần. Hạng nào để trống sẽ bị xóa khỏi kỳ đó, nên có thể nhập lại để sửa.</p>
      <form action={saveLeaderboardBulk} className="mt-5 grid gap-5">
        <input type="hidden" name="return_to" value={returnTo} />
        <div className="grid gap-4 md:grid-cols-3">
          <label className={adminLabel}>Cơ sở
            <select name="branch_slug" required defaultValue="" className={`${adminInput} mt-1`}>
              <option value="" disabled>Chọn cơ sở</option>
              {branches.map((branch) => <option key={branch.slug} value={branch.slug}>{branch.name}</option>)}
            </select>
          </label>
          <label className={adminLabel}>Xếp hạng theo
            <select name="period_type" defaultValue="week" className={`${adminInput} mt-1`}>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
            </select>
          </label>
          <label className={adminLabel}>Một ngày bất kỳ trong kỳ đó
            <input type="date" name="period_start" required defaultValue={today} className={`${adminInput} mt-1`} />
          </label>
        </div>

        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((rank) => (
            <div key={rank} className="grid grid-cols-[2.5rem_1fr_7rem] items-end gap-3 sm:grid-cols-[3rem_1fr_9rem]">
              <span className={`grid h-12 place-items-center rounded-lg font-display text-3xl ${rank === 1 ? "neon-glow bg-accent text-ground" : "bg-ground text-white"}`} aria-hidden="true">{rank}</span>
              <label className={adminLabel}><span className="sr-only">Nickname hạng {rank}</span>
                <input name={`name_${rank}`} maxLength={40} placeholder={`Nickname hạng ${rank}`} className={adminInput} />
              </label>
              <label className={adminLabel}><span className="sr-only">Điểm hạng {rank}</span>
                <input name={`points_${rank}`} type="number" min="0" inputMode="numeric" placeholder="Điểm" className={adminInput} />
              </label>
            </div>
          ))}
        </div>

        <div className="grid gap-1">
          <label className="flex min-h-11 items-center gap-3 text-base text-zinc-200">
            <input type="checkbox" name="consent_confirmed" className="size-5 accent-violet-500" />
            Các người chơi trên đã đồng ý hiển thị công khai
          </label>
          <label className="flex min-h-11 items-center gap-3 text-base text-zinc-200">
            <input type="checkbox" name="published" className="size-5 accent-violet-500" />
            Hiển thị ngay trên website (cần tích ô đồng ý ở trên)
          </label>
        </div>
        <button className={`${adminButton} justify-self-start`}>Lưu top 5</button>
      </form>
    </details>
  );
}
