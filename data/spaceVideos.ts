import type { SpaceVideo } from "@/types/space";

const base = "/videos/khong-gian";

/** Clips for the "Không gian Tiger" section. To add one: put the .mp4 and a .webp poster in public/videos/khong-gian and add a line here. */
export const spaceVideos: SpaceVideo[] = [
  { id: "hall", title: "Sảnh máy Tiger Esports", video: `${base}/hall.mp4`, poster: `${base}/hall.webp`, featured: true },
  { id: "tft-1", title: "Đấu Trường Chân Lý", video: `${base}/tft-1.mp4`, poster: `${base}/tft-1.webp` },
  { id: "valorant", title: "Valorant", video: `${base}/valorant.mp4`, poster: `${base}/valorant.webp` },
  { id: "floor", title: "Không gian thi đấu", video: `${base}/floor.mp4`, poster: `${base}/floor.webp` },
  { id: "tft-2", title: "Khoảnh khắc trên máy", video: `${base}/tft-2.mp4`, poster: `${base}/tft-2.webp` },
];

/** Soft looping clip behind the featured tournament panel. */
export const ambientVideo = { video: `${base}/player.mp4`, poster: `${base}/player.webp` };

/** Wide photo of the shop used as the faint background of the section. */
export const spaceBackdrop = { src: "/images/community/khong-gian.webp", alt: "Không gian quán Tiger Esports" };
