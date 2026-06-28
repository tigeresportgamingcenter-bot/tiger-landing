import type { HallOfFameContent } from "@/types";

export const hallOfFame: HallOfFameContent = {
  tournaments: [
    {
      id: "tournament-fc-2026",
      status: "placeholder",
      name: null,
      game: "FC Online",
      heldOn: null,
      branchName: null,
      placements: [],
      image: { src: "/images/hall-of-fame/tournament-fc-2026.webp", alt: "Giải đấu FC Online tại Tiger Esports" },
    },
    {
      id: "tournament-valorant-2026",
      status: "placeholder",
      name: null,
      game: "Valorant",
      heldOn: null,
      branchName: null,
      placements: [],
      image: { src: "/images/hall-of-fame/tournament-valorant-2026.webp", alt: "Giải đấu Valorant tại Tiger Esports" },
    },
  ],
  members: [
    {
      id: "member-diamond",
      status: "placeholder",
      displayName: null,
      tier: null,
      periodLabel: null,
      consentConfirmed: false,
      image: { src: "/images/members/member-diamond.webp", alt: "Hội viên Diamond tại Tiger Esports" },
    },
  ],
  consentNotice: "Danh sách vinh danh theo từng tháng và chỉ hiển thị khi khách hàng đồng ý.",
};
