import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Medal, Play, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MediaPreview } from "@/components/ui/MediaPreview";
import { getPublishedTournamentBySlug } from "@/services/contentService";
import type { TournamentStatus } from "@/types";

export const revalidate = 60;

const statusLabels: Record<TournamentStatus, string> = {
  upcoming: "Sắp diễn ra",
  registration_open: "Đang mở đăng ký",
  ongoing: "Đang diễn ra",
  completed: "Đã kết thúc",
};
const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tournament = await getPublishedTournamentBySlug((await params).slug);
  if (!tournament) return { title: "Không tìm thấy giải đấu | Tiger Esports" };
  const socialImage = tournament.image ?? tournament.video?.poster;
  const description = tournament.status === "completed" ? tournament.summaryContent || tournament.description : tournament.description || `${tournament.game} tại ${tournament.branchName ?? "Tiger Esports"}`;
  return { title: `${tournament.name} | Tiger Esports`, description, openGraph: { title: tournament.name, description, images: socialImage ? [socialImage.src] : undefined } };
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = await getPublishedTournamentBySlug((await params).slug);
  if (!tournament) notFound();
  const eventDate = formatDate(tournament.startsAt ?? tournament.heldOn);
  const visual = tournament.image ?? tournament.video?.poster;
  const isCompleted = tournament.status === "completed";

  return (
    <main className="min-h-screen bg-black py-10 sm:py-16">
      <Container>
        <Link href="/#giai-dau" className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"><ArrowLeft className="size-4" />Quay lại trang chủ</Link>
        <article className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
          {visual ? (
            <div className="relative aspect-[16/9] max-h-[620px]">
              <Image src={visual.src} alt={visual.alt} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ) : null}
          <div className="p-6 sm:p-10 lg:p-14">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-tiger-orange/15 px-3 py-1 text-xs font-bold uppercase text-orange-300">{tournament.game}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-400">{statusLabels[tournament.status]}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">{isCompleted && tournament.summaryTitle ? tournament.summaryTitle : tournament.name}</h1>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-400">
              {eventDate ? <span className="flex items-center gap-2"><CalendarDays className="size-4 text-tiger-orange" />{eventDate}</span> : null}
              {tournament.branchName ? <span className="flex items-center gap-2"><MapPin className="size-4 text-tiger-orange" />{tournament.branchName}</span> : null}
              {tournament.entryFee !== null ? <span className="flex items-center gap-2"><Ticket className="size-4 text-tiger-orange" />{tournament.entryFee === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(tournament.entryFee)}đ`}</span> : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {tournament.registrationOpen && tournament.registrationUrl ? <a href={tournament.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-to-r from-tiger-red to-tiger-orange px-6 text-sm font-bold text-white">Đăng ký ngay</a> : null}
              {tournament.video ? <a href="#recap" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-tiger-orange/50 px-5 text-sm font-bold text-white hover:bg-tiger-orange"><Play className="size-4 fill-current" />Xem recap</a> : null}
              {tournament.facebookPostUrl ? <a href={tournament.facebookPostUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-white hover:border-tiger-orange"><ExternalLink className="size-4" />Bài Facebook</a> : null}
            </div>

            {isCompleted && (tournament.summaryContent || tournament.highlights.length) ? (
              <section className="mt-10">
                <h2 className="text-xl font-extrabold text-white">Tổng kết giải đấu</h2>
                {tournament.summaryContent ? <p className="mt-3 whitespace-pre-line leading-7 text-zinc-400">{tournament.summaryContent}</p> : null}
                {tournament.highlights.length ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                    {tournament.highlights.map((highlight) => <li key={highlight} className="rounded-xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-300">{highlight}</li>)}
                  </ul>
                ) : null}
              </section>
            ) : null}

            {!isCompleted && tournament.description ? <section className="mt-10"><h2 className="text-xl font-extrabold text-white">Giới thiệu</h2><p className="mt-3 whitespace-pre-line leading-7 text-zinc-400">{tournament.description}</p></section> : null}
            {tournament.rules ? <section className="mt-8"><h2 className="text-xl font-extrabold text-white">Thể lệ</h2><p className="mt-3 whitespace-pre-line leading-7 text-zinc-400">{tournament.rules}</p></section> : null}
            {tournament.video ? <section id="recap" className="mt-10 scroll-mt-24"><h2 className="text-xl font-extrabold text-white">Video recap</h2><div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10"><MediaPreview video={tournament.video} title={`Recap ${tournament.name}`} /></div></section> : null}
            {tournament.placements.length ? (
              <section className="mt-10">
                <h2 className="text-xl font-extrabold text-white">Kết quả</h2>
                <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                  {tournament.placements.map((placement) => <li key={placement.position} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-4"><span className="flex items-center gap-2 text-sm font-bold text-orange-300"><Medal className="size-4" />{placementLabels[placement.position]}</span><span className="font-semibold text-white">{placement.displayName}</span></li>)}
                </ol>
              </section>
            ) : null}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-bold text-white">Về trang chủ</Link></div>
          </div>
        </article>
      </Container>
    </main>
  );
}
