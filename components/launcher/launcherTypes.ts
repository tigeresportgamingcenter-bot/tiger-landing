import type { HonoredMember, LeaderboardEntry, Promotion, TournamentEvent } from "@/types";

export interface LauncherBranch {
  id: string;
  name: string;
}

export interface LauncherData {
  brandName: string;
  hotline: string;
  promotions: Promotion[];
  upcomingPromotions: Promotion[];
  events: TournamentEvent[];
  completedEvents: TournamentEvent[];
  leaderboard: LeaderboardEntry[];
  members: HonoredMember[];
  branches: LauncherBranch[];
  complaintUrl: string | null;
  complaintQr: string | null;
  zaloUrl: string | null;
  zaloQr: string | null;
  /** Registration QR codes keyed by tournament id. */
  registrationQr: Record<string, string>;
}

export type SlideKey = "promotions" | "tournaments" | "results" | "ranking" | "complaint";
