import type { HallOfFameContent } from "@/types";

export const hallOfFame: HallOfFameContent = {
  tournaments: [
    {
      id: "fc-open-cup-summer-2026",
      slug: "fc-open-cup-summer-2026",
      status: "verified",
      name: "FC Online Tiger Open Cup Summer 2026",
      game: "FC Online",
      heldOn: "2026-06-27",
      branchName: "Tiger 4 Phố Môi",
      placements: [],
      image: { src: "/images/hall-of-fame/tournament-fc-2026.webp", alt: "Trao giải FC Online Tiger Open Cup Summer 2026 tại Tiger 4 Phố Môi" },
      video: null,
      showInHallOfFame: true,
    },
    {
      id: "tournament-valorant-2026",
      slug: "tournament-valorant-2026",
      status: "placeholder",
      name: null,
      game: "Valorant",
      heldOn: null,
      branchName: null,
      placements: [],
      image: { src: "/images/hall-of-fame/tournament-valorant-2026.webp", alt: "Giải đấu Valorant tại Tiger Esports" },
      video: null,
      showInHallOfFame: false,
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
