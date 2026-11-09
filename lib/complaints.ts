export const complaintCategories = [
  { value: "service", label: "Thái độ phục vụ" },
  { value: "equipment", label: "Máy móc, thiết bị" },
  { value: "billing", label: "Tính tiền, nạp tiền, combo" },
  { value: "tournament", label: "Giải đấu" },
  { value: "hygiene", label: "Vệ sinh, không gian" },
  { value: "other", label: "Vấn đề khác" },
] as const;

export const complaintStatuses = [
  { value: "new", label: "Mới tiếp nhận" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "resolved", label: "Đã giải quyết" },
  { value: "rejected", label: "Đã từ chối" },
] as const;

export type ComplaintStatus = (typeof complaintStatuses)[number]["value"];

export const complaintStatusLabel = (status: string) => complaintStatuses.find((item) => item.value === status)?.label ?? status;
export const complaintCategoryLabel = (category: string) => complaintCategories.find((item) => item.value === category)?.label ?? category;

export interface SubmitComplaintState {
  status: "idle" | "success" | "error";
  message?: string;
  code?: string;
  demo?: boolean;
  values?: Record<string, string>;
}

export interface ComplaintTrackResult {
  status: ComplaintStatus;
  publicResponse: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export interface TrackComplaintState {
  status: "idle" | "found" | "not-found" | "error";
  message?: string;
  values?: Record<string, string>;
  result?: ComplaintTrackResult;
  demo?: boolean;
}

export const complaintSteps = [
  { title: "Gửi phản ánh", description: "Điền form, chọn cơ sở và mô tả vấn đề. Bạn nhận ngay mã tra cứu." },
  { title: "Tiếp nhận và xử lý", description: "Quản lý cơ sở xem xét, liên hệ xác minh và xử lý." },
  { title: "Phản hồi", description: "Kết quả được cập nhật. Tra cứu bằng mã và số điện thoại của bạn." },
] as const;
