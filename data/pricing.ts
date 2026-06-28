import type { PricingPlan } from "@/types";

export const pricing: PricingPlan[] = [
  { tierId: "competition", tier: "Thi đấu", pricePerHour: 14445, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchIds: [], validFrom: null, validUntil: null, promotionStatus: "unverified" },
  { tierId: "svip", tier: "SVIP", pricePerHour: 11503, note: "Hạng máy hiệu năng cao.", branchIds: [], validFrom: null, validUntil: null, promotionStatus: "unverified" },
  { tierId: "vip", tier: "VIP", pricePerHour: 9450, note: "Phù hợp các game esports phổ biến.", branchIds: [], validFrom: null, validUntil: null, promotionStatus: "unverified" },
  { tierId: "core", tier: "Core", pricePerHour: 7475, note: "Lựa chọn gaming tiết kiệm.", branchIds: [], validFrom: null, validUntil: null, promotionStatus: "unverified" },
];
