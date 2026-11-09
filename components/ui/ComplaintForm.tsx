"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState, useState } from "react";
import { submitComplaint } from "@/app/khieu-nai/actions";
import { complaintCategories, type SubmitComplaintState } from "@/lib/complaints";
import type { Branch } from "@/types";

const initialState: SubmitComplaintState = { status: "idle" };
const inputClass = "min-h-12 w-full rounded-lg bg-panel px-4 text-base text-white placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function ComplaintForm({ branches, hotline }: { branches: Pick<Branch, "id" | "name">[]; hotline: string }) {
  const [state, action, pending] = useActionState(submitComplaint, initialState);
  const [length, setLength] = useState(0);
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-lg bg-panel p-6 sm:p-8" role="status">
        <CheckCircle2 className="size-8 text-accent" aria-hidden="true" />
        <h2 className="mt-4 font-display text-4xl uppercase text-white">Đã tiếp nhận phản ánh</h2>
        <p className="mt-3 text-lg text-zinc-300">Mã tra cứu của bạn</p>
        <p className="mt-1 font-display text-6xl tracking-wide text-accent">{state.code}</p>
        <p className="mt-4 max-w-[52ch] text-base leading-7 text-zinc-300">Hãy lưu lại mã này. Bạn có thể tra cứu tiến độ bất cứ lúc nào bằng mã cùng số điện thoại đã đăng ký. Cần hỗ trợ gấp, vui lòng gọi <a href={`tel:${hotline}`} className="font-semibold text-white underline">{hotline}</a>.</p>
        {state.demo ? <p className="mt-4 rounded-lg bg-accent/15 px-4 py-3 text-base text-zinc-200">Chế độ demo: phản ánh này không được lưu. Dùng mã trên ở ô tra cứu để xem thử kết quả.</p> : null}
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 rounded-lg bg-panel/60 p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-base font-semibold text-white">Họ và tên
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" defaultValue={values.name} className={inputClass} placeholder="Nguyễn Văn A" />
        </label>
        <label className="grid gap-2 text-base font-semibold text-white">Số điện thoại
          <input name="phone" required inputMode="tel" autoComplete="tel" defaultValue={values.phone} className={inputClass} placeholder="09xx xxx xxx" />
        </label>
        <label className="grid gap-2 text-base font-semibold text-white">Cơ sở liên quan
          <select key={`branch-${values.branch ?? ""}`} name="branch" defaultValue={values.branch ?? ""} className={inputClass}>
            <option value="">Không chỉ định</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-base font-semibold text-white">Nhóm vấn đề
          <select key={`category-${values.category ?? ""}`} name="category" required defaultValue={values.category ?? ""} className={inputClass}>
            <option value="" disabled>Chọn nhóm vấn đề</option>
            {complaintCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-base font-semibold text-white">Nội dung phản ánh
        <textarea name="content" required minLength={10} maxLength={2000} rows={6} defaultValue={values.content} onChange={(event) => setLength(event.target.value.length)} className={`${inputClass} py-3`} placeholder="Mô tả điều đã xảy ra: thời gian, cơ sở, máy số mấy, nhân viên liên quan nếu có." />
        <span className="text-[13px] font-normal text-zinc-400">{Math.max(length, values.content?.length ?? 0)}/2000 ký tự</span>
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex items-start gap-3 text-base text-zinc-300">
        <input type="checkbox" name="consent" required className="mt-1 size-5 accent-violet-500" />
        <span>Tôi đồng ý để Tiger Esports dùng họ tên và số điện thoại này chỉ để xác minh và phản hồi khiếu nại.</span>
      </label>
      {state.status === "error" ? <p role="alert" className="rounded-lg bg-red-500/15 px-4 py-3 text-base text-red-200">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="press min-h-12 rounded-lg bg-accent px-6 text-base font-bold text-ground transition hover:bg-[#c98bff] disabled:opacity-60 sm:justify-self-start">{pending ? "Đang gửi..." : "Gửi khiếu nại"}</button>
    </form>
  );
}
