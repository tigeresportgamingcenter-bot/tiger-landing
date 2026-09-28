import type { PricingPlan } from "@/types";

export const pricing: PricingPlan[] = [
  { tierId: "competition", tier: "Thi đấu", pricePerHour: 14445, nightComboPrice: 40000, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchScope: null },
  { tierId: "svip", tier: "SVIP", pricePerHour: 11503, nightComboPrice: 30000, note: "Hạng máy hiệu năng cao.", branchScope: null },
  { tierId: "vip", tier: "VIP", pricePerHour: 9450, nightComboPrice: 30000, note: "Phù hợp các game esports phổ biến.", branchScope: null },
  { tierId: "core", tier: "Core", pricePerHour: 7475, nightComboPrice: 30000, note: "Lựa chọn gaming tiết kiệm.", branchScope: null },
];
