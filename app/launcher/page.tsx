import type { Metadata } from "next";
import { LauncherShell } from "@/components/launcher/LauncherShell";
import type { LauncherData } from "@/components/launcher/launcherTypes";
import { qrDataUrl } from "@/lib/qr";
import { getSiteContent } from "@/services/contentService";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tiger Esports | Bảng tin tại quán",
  robots: { index: false, follow: false },
};

async function qrOrNull(value: string | null) {
  return value ? qrDataUrl(value) : null;
}

export default async function LauncherPage() {
  const content = await getSiteContent();
  const hotline = content.socialLinks.hotline;
  if (!hotline) throw new Error("Hotline is required for the launcher.");

  const events = content.tournamentEvents.slice(0, 4);
  const registrationEntries = await Promise.all(
    events.filter((event) => event.registrationOpen && event.registrationUrl).map(async (event) => [event.id, await qrDataUrl(event.registrationUrl ?? "")] as const),
  );

  const data: LauncherData = {
    brandName: content.siteSettings.brandName,
    hotline,
    promotions: content.promotions,
    upcomingPromotions: content.upcomingPromotions,
    events,
    completedEvents: content.completedTournamentEvents.slice(0, 3),
    leaderboard: content.leaderboard,
    members: content.hallOfFame.members.filter((member) => member.status === "verified" && member.consentConfirmed && member.displayName),
    branches: content.branches.map((branch) => ({ id: branch.id, name: branch.name })),
    complaintUrl: content.socialLinks.complaintForm,
    complaintQr: await qrOrNull(content.socialLinks.complaintForm),
    zaloUrl: content.socialLinks.zalo,
    zaloQr: await qrOrNull(content.socialLinks.zalo),
    registrationQr: Object.fromEntries(registrationEntries),
  };

  return <LauncherShell data={data} />;
}
