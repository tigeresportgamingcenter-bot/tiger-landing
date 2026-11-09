"use server";

import { createClient } from "@supabase/supabase-js";
import { complaintCategories, type ComplaintStatus, type SubmitComplaintState, type TrackComplaintState } from "@/lib/complaints";
import { isDemoEnabled } from "@/lib/demo";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

const demoCode = "KN-DEMO01";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function anonClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

const unavailable = "Hệ thống tiếp nhận chưa sẵn sàng. Vui lòng gọi hotline để được hỗ trợ.";

export async function submitComplaint(_previous: SubmitComplaintState, formData: FormData): Promise<SubmitComplaintState> {
  if (field(formData, "website")) return { status: "success", code: demoCode };

  const name = field(formData, "name");
  const phone = field(formData, "phone");
  const branch = field(formData, "branch");
  const category = field(formData, "category");
  const content = field(formData, "content");
  const phoneDigits = phone.replace(/\D/g, "");
  const values = { name, phone, branch, category, content };
  const fail = (message: string): SubmitComplaintState => ({ status: "error", message, values });

  if (name.length < 2 || name.length > 80) return fail("Vui lòng nhập họ tên từ 2 đến 80 ký tự.");
  if (phoneDigits.length < 9 || phoneDigits.length > 12) return fail("Số điện thoại chưa hợp lệ.");
  if (!complaintCategories.some((item) => item.value === category)) return fail("Vui lòng chọn nhóm vấn đề.");
  if (content.length < 10 || content.length > 2000) return fail("Nội dung cần từ 10 đến 2000 ký tự.");
  if (formData.get("consent") !== "on") return fail("Bạn cần đồng ý để Tiger dùng thông tin này xử lý khiếu nại.");

  if (!isSupabaseConfigured()) {
    return isDemoEnabled() ? { status: "success", code: demoCode, demo: true } : fail(unavailable);
  }

  const { data, error } = await anonClient().rpc("submit_complaint", { p_name: name, p_phone: phoneDigits, p_branch: branch || null, p_category: category, p_content: content, p_consent: true });
  if (error || typeof data !== "string") {
    if (error?.message.includes("rate_limited")) return fail("Số điện thoại này đã gửi nhiều phản ánh trong hôm nay. Vui lòng gọi hotline để được hỗ trợ nhanh hơn.");
    return fail(unavailable);
  }
  return { status: "success", code: data };
}

export async function trackComplaint(_previous: TrackComplaintState, formData: FormData): Promise<TrackComplaintState> {
  const code = field(formData, "code").toUpperCase();
  const rawPhone = field(formData, "phone");
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const values = { code, phone: rawPhone };
  if (!code || phoneDigits.length < 9) return { status: "error", message: "Vui lòng nhập mã khiếu nại và số điện thoại.", values };

  if (!isSupabaseConfigured()) {
    if (!isDemoEnabled()) return { status: "error", message: unavailable, values };
    if (code !== demoCode) return { status: "not-found", demo: true, values };
    return { status: "found", demo: true, values, result: { status: "in_progress", publicResponse: "Đây là phản hồi demo: quản lý cơ sở đã nhận phản ánh và đang liên hệ xác minh.", createdAt: new Date().toISOString(), respondedAt: new Date().toISOString() } };
  }

  const { data, error } = await anonClient().rpc("track_complaint", { p_code: code, p_phone: phoneDigits });
  if (error) return { status: "error", message: unavailable, values };
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return { status: "not-found", values };
  return { status: "found", values, result: { status: row.status as ComplaintStatus, publicResponse: row.public_response ?? null, createdAt: row.created_at, respondedAt: row.responded_at ?? null } };
}
