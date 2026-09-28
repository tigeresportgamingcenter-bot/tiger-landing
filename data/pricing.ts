import type { PricingPlan } from "@/types";

export const pricing: PricingPlan[] = [
  // Tiger X - Trường Thi
  { tierId: "tiger-x-competition", tier: "Thi đấu", pricePerHour: 13375, nightComboPrice: 40000, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchScope: "Tiger X" },
  { tierId: "tiger-x-svip", tier: "SVIP", pricePerHour: 11503, nightComboPrice: 30000, note: "Hạng máy hiệu năng cao.", branchScope: "Tiger X" },
  { tierId: "tiger-x-vip", tier: "VIP", pricePerHour: 9398, nightComboPrice: 30000, note: "Phù hợp các game esports phổ biến.", branchScope: "Tiger X" },

  // Tiger 2 - Quảng Tiến
  { tierId: "tiger-2-competition", tier: "Thi đấu", pricePerHour: 13300, nightComboPrice: 40000, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchScope: "Tiger 2" },
  { tierId: "tiger-2-svip", tier: "SVIP", pricePerHour: 10630, nightComboPrice: 30000, note: "Hạng máy hiệu năng cao.", branchScope: "Tiger 2" },
  { tierId: "tiger-2-vip", tier: "VIP", pricePerHour: 9450, nightComboPrice: 30000, note: "Phù hợp các game esports phổ biến.", branchScope: "Tiger 2" },
  { tierId: "tiger-2-core", tier: "Core", pricePerHour: 7475, nightComboPrice: 30000, note: "Lựa chọn gaming tiết kiệm.", branchScope: "Tiger 2" },
  { tierId: "tiger-2-smoking", tier: "Hút thuốc", pricePerHour: 9630, nightComboPrice: 30000, note: "Khu vực hút thuốc riêng biệt.", branchScope: "Tiger 2" },

  // Tiger 3 - Quang Trung
  { tierId: "tiger-3-competition", tier: "Thi đấu", pricePerHour: 14445, nightComboPrice: 40000, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchScope: "Tiger 3" },
  { tierId: "tiger-3-svip", tier: "SVIP", pricePerHour: 11503, nightComboPrice: 30000, note: "Hạng máy hiệu năng cao.", branchScope: "Tiger 3" },
  { tierId: "tiger-3-vip", tier: "VIP", pricePerHour: 9450, nightComboPrice: 30000, note: "Phù hợp các game esports phổ biến.", branchScope: "Tiger 3" },
  { tierId: "tiger-3-core", tier: "Core", pricePerHour: 7475, nightComboPrice: 30000, note: "Lựa chọn gaming tiết kiệm.", branchScope: "Tiger 3" },

  // Tiger 4 - Phố Môi
  { tierId: "tiger-4-competition", tier: "Thi đấu", pricePerHour: 14445, nightComboPrice: 40000, note: "Màn hình 360Hz, tối ưu thi đấu.", featured: true, branchScope: "Tiger 4" },
  { tierId: "tiger-4-svip", tier: "SVIP", pricePerHour: 11503, nightComboPrice: 30000, note: "Hạng máy hiệu năng cao.", branchScope: "Tiger 4" },
  { tierId: "tiger-4-vip", tier: "VIP", pricePerHour: 9450, nightComboPrice: 30000, note: "Phù hợp các game esports phổ biến.", branchScope: "Tiger 4" },
  { tierId: "tiger-4-smoking", tier: "Hút thuốc", pricePerHour: 7475, nightComboPrice: 30000, note: "Khu vực hút thuốc riêng biệt.", branchScope: "Tiger 4" },
  { tierId: "tiger-4-core", tier: "Core", pricePerHour: 7475, nightComboPrice: 30000, note: "Lựa chọn gaming tiết kiệm.", branchScope: "Tiger 4" },
];
