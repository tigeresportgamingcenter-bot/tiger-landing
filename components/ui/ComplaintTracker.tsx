"use client";

import { useActionState } from "react";
import { trackComplaint } from "@/app/khieu-nai/actions";
import { complaintStatusLabel, type TrackComplaintState } from "@/lib/complaints";

const initialState: TrackComplaintState = { status: "idle" };
const inputClass = "min-h-12 w-full rounded-lg bg-panel px-4 text-base text-white placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

export function ComplaintTracker() {
  const [state, action, pending] = useActionState(trackComplaint, initialState);

  return (
    <div>
      <form action={action} className="grid gap-4" noValidate>
        <label className="grid gap-2 text-base font-semibold text-white">Mã khiếu nại
          <input name="code" required autoCapitalize="characters" defaultValue={state.values?.code} className={inputClass} placeholder="KN-XXXXXX" />
        </label>
        <label className="grid gap-2 text-base font-semibold text-white">Số điện thoại đã đăng ký
          <input name="phone" required inputMode="tel" autoComplete="tel" defaultValue={state.values?.phone} className={inputClass} placeholder="09xx xxx xxx" />
        </label>
        <button type="submit" disabled={pending} className="press min-h-12 rounded-lg bg-white/10 px-6 text-base font-bold text-white transition hover:bg-white/20 disabled:opacity-60 sm:justify-self-start">{pending ? "Đang tra cứu..." : "Tra cứu tiến độ"}</button>
      </form>
      <div aria-live="polite" className="mt-5">
        {state.status === "found" && state.result ? (
          <div className="rounded-lg bg-panel p-5">
            <p className="text-base text-zinc-400">Tình trạng</p>
            <p className="font-display text-4xl uppercase text-accent">{complaintStatusLabel(state.result.status)}</p>
            <p className="mt-2 text-base text-zinc-300">Gửi lúc {formatDateTime(state.result.createdAt)}</p>
            {state.result.publicResponse ? (
              <div className="mt-4">
                <p className="text-base font-semibold text-white">Phản hồi từ Tiger{state.result.respondedAt ? ` (${formatDateTime(state.result.respondedAt)})` : ""}</p>
                <p className="mt-1 whitespace-pre-line text-base leading-7 text-zinc-300">{state.result.publicResponse}</p>
              </div>
            ) : <p className="mt-4 text-base text-zinc-300">Chưa có phản hồi chi tiết. Chúng tôi sẽ cập nhật tại đây.</p>}
            {state.demo ? <p className="mt-4 text-[13px] text-zinc-400">Chế độ demo: dữ liệu minh hoạ.</p> : null}
          </div>
        ) : null}
        {state.status === "not-found" ? <p role="alert" className="rounded-lg bg-red-500/15 px-4 py-3 text-base text-red-200">Không tìm thấy khiếu nại khớp với mã và số điện thoại này. Vui lòng kiểm tra lại.</p> : null}
        {state.status === "error" ? <p role="alert" className="rounded-lg bg-red-500/15 px-4 py-3 text-base text-red-200">{state.message}</p> : null}
      </div>
    </div>
  );
}
