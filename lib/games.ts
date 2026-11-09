import type { SupportedGame } from "@/types";

export const supportedGames: SupportedGame[] = ["TFT", "LoL", "FC Online", "Valorant", "AOE"];

export const gameLabels: Record<SupportedGame, string> = {
  TFT: "Đấu Trường Chân Lý",
  LoL: "Liên Minh Huyền Thoại",
  "FC Online": "FC Online",
  Valorant: "Valorant",
  AOE: "AOE",
};

export const gameLabel = (game: string) => gameLabels[game as SupportedGame] ?? game;
