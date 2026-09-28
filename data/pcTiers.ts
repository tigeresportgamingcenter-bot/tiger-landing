import type { PcTier } from "@/types";

const descriptions = {
  competition: "Cấu hình mạnh nhất, ưu tiên cho thi đấu và luyện tập chuyên sâu.",
  svip: "Hiệu năng cao, trải nghiệm mượt cho hầu hết tựa game hiện nay.",
  vip: "Cân tốt các tựa game esports phổ biến, giá hợp lý.",
  core: "Lựa chọn tiết kiệm cho mọi cuộc vui cùng đồng đội.",
  smoking: "Khu vực hút thuốc riêng biệt, cấu hình tương đương hạng VIP/SVIP.",
};

export const pcTiers: PcTier[] = [
  // Tiger X - Trường Thi
  { id: "tiger-x-competition", name: "Thi đấu", subtitle: null, cpu: "Intel Core i5 13400F", gpu: "RTX 3060 Ti", ram: "16GB DDR4", monitor: "24 inch 360Hz", mainboard: "B760", storage: null, peripherals: "Chuột Gaming Zidli ZGM03 Pro, Phím Gaming Zidli K980, Tai nghe DAREU EH925", note: null, branchScope: "Tiger X", featured: true, description: descriptions.competition },
  { id: "tiger-x-svip", name: "SVIP", subtitle: null, cpu: "AMD Ryzen 5 5500X", gpu: "RTX 2070 Super", ram: "16GB DDR4", monitor: "24 inch 260Hz", mainboard: "B450", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH722X", note: null, branchScope: "Tiger X", featured: false, description: descriptions.svip },
  { id: "tiger-x-vip", name: "VIP", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger X", featured: false, description: descriptions.vip },

  // Tiger 2 - Quảng Tiến
  { id: "tiger-2-competition", name: "Thi đấu", subtitle: null, cpu: "AMD Ryzen 5 5700X", gpu: "RTX 3060 Ti", ram: "16GB DDR4", monitor: "27 inch 360Hz", mainboard: "B450", storage: null, peripherals: "Chuột Gaming Logitech G403, Phím Gaming Zidli K980, Tai nghe ZIDLI ZHG03", note: null, branchScope: "Tiger 2", featured: true, description: descriptions.competition },
  { id: "tiger-2-svip", name: "SVIP", subtitle: null, cpu: "Intel Core i5 10400F", gpu: "RTX 2060 Super", ram: "16GB DDR4", monitor: "27 inch 240Hz", mainboard: "B560", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 2", featured: false, description: descriptions.svip },
  { id: "tiger-2-vip", name: "VIP", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 2", featured: false, description: descriptions.vip },
  { id: "tiger-2-core", name: "Core", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "GTX 1060 6G", ram: "16GB DDR4", monitor: "24 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN E, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 2", featured: false, description: descriptions.core },
  { id: "tiger-2-smoking", name: "Hút thuốc", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 2", featured: false, description: descriptions.smoking },

  // Tiger 3 - Quang Trung
  { id: "tiger-3-competition", name: "Thi đấu", subtitle: null, cpu: "Intel Core i5 12400F", gpu: "RTX 3060 Ti", ram: "16GB DDR4", monitor: "25.5 inch 360Hz", mainboard: "H610", storage: null, peripherals: "Chuột Gaming Zidli ZGM03 + Zowie EC2-C, Phím Gaming Zidli K980, Tai nghe HyperX Cloud III", note: null, branchScope: "Tiger 3", featured: true, description: descriptions.competition },
  { id: "tiger-3-svip", name: "SVIP", subtitle: null, cpu: "Intel Core i5 10400F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 240Hz", mainboard: "B560", storage: null, peripherals: "Chuột Logitech G102, Phím Gaming Zidli K980, Tai nghe DAREU EH722X", note: null, branchScope: "Tiger 3", featured: false, description: descriptions.svip },
  { id: "tiger-3-vip", name: "VIP", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 3", featured: false, description: descriptions.vip },
  { id: "tiger-3-core", name: "Core", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "GTX 1060 6G", ram: "16GB DDR4", monitor: "27 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN E, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 3", featured: false, description: descriptions.core },

  // Tiger 4 - Phố Môi
  { id: "tiger-4-competition", name: "Thi đấu", subtitle: null, cpu: "Intel Core i5 12400F", gpu: "RTX 3060 Ti", ram: "16GB DDR4", monitor: "25.5 inch 360Hz", mainboard: "H610", storage: null, peripherals: "Chuột Gaming Zidli ZGM03 + Zowie EC2-C, Phím Gaming Zidli K980, Tai nghe ZIDLI ZHG03", note: null, branchScope: "Tiger 4", featured: true, description: descriptions.competition },
  { id: "tiger-4-svip", name: "SVIP", subtitle: null, cpu: "Intel Core i3 12100F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 240Hz", mainboard: "B560", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN S, Tai nghe DAREU EH925", note: null, branchScope: "Tiger 4", featured: false, description: descriptions.svip },
  { id: "tiger-4-vip", name: "VIP", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 180Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN D, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 4", featured: false, description: descriptions.vip },
  { id: "tiger-4-smoking", name: "Hút thuốc", subtitle: null, cpu: "Intel Core i5 11405F", gpu: "RTX 1660 Super", ram: "16GB DDR4", monitor: "27 inch 180Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN S, Tai nghe DAREU EH722X", note: null, branchScope: "Tiger 4", featured: false, description: descriptions.smoking },
  { id: "tiger-4-core", name: "Core", subtitle: null, cpu: "Intel Core i3 10105F", gpu: "GTX 1060 6G", ram: "16GB DDR4", monitor: "24 inch 165Hz", mainboard: "H510", storage: null, peripherals: "Chuột Logitech G102, Phím FUHLEN E, Tai nghe DAREU EH416", note: null, branchScope: "Tiger 4", featured: false, description: descriptions.core },
];
