import type { PcTier } from "@/types";

export const pcTiers: PcTier[] = [
  { id: "competition", name: "Thi đấu", subtitle: null, cpu: "Intel Core i5", gpu: "RTX 3060 Ti hoặc tương đương", ram: "16GB", monitor: "360Hz", mainboard: null, storage: null, peripherals: null, note: null, branchScope: null, featured: true, description: "FPS tối đa, phản hồi nhanh cho những trận đấu nghiêm túc." },
  { id: "svip", name: "SVIP", subtitle: null, cpu: "Intel Core i5 / i3 thế hệ mới", gpu: "GTX 1660S hoặc tương đương", ram: "16GB", monitor: "Theo cơ sở", mainboard: null, storage: null, peripherals: null, note: null, branchScope: null, featured: false, description: "Hiệu năng mạnh, trải nghiệm mượt và thoải mái." },
  { id: "vip", name: "VIP", subtitle: null, cpu: "Intel Core i3", gpu: "GTX 1660S", ram: "16GB", monitor: "Theo cơ sở", mainboard: null, storage: null, peripherals: null, note: null, branchScope: null, featured: false, description: "Cân tốt các tựa game esports phổ biến hiện nay." },
  { id: "core", name: "Core", subtitle: null, cpu: "Intel Core i3", gpu: "GTX 1650", ram: "16GB", monitor: "Theo cơ sở", mainboard: null, storage: null, peripherals: null, note: null, branchScope: null, featured: false, description: "Lựa chọn tiết kiệm cho mọi cuộc vui cùng đồng đội." },
];
