import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Medal, Play, Swords, Ticket, Trophy } from "lucide-react";
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

function cleanLine(value: string) {
  return value
    .replace(/^\s*(#{1,6}\s+|[-*•]+\s*)/, "")
    .replace(/\*/g, "")
    .replace(/_{2,}/g, "")
    .replace(/-{3,}/g, " ")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0E\uFE0F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanText(value: string) {
  return value.split(/\r?\n/).map(cleanLine).filter(Boolean).join(" ");
}

function EditorialText({ value }: { value: string }) {
  const lines = value.split(/\r?\n/).map((line) => ({ raw: line, clean: cleanLine(line) })).filter((line) => line.clean);
  const blocks: Array<{ type: "paragraph" | "list"; items: string[] }> = [];
  for (const line of lines) {
    const isList = /^\s*[-*•]\s+/.test(line.raw);
    const previous = blocks.at(-1);
    if (isList && previous?.type === "list") previous.items.push(line.clean);
    else if (isList) blocks.push({ type: "list", items: [line.clean] });
    else blocks.push({ type: "paragraph", items: [line.clean] });
  }
  return <div className="space-y-4">{blocks.map((block, index) => block.type === "list" ? <ul key={index} className="space-y-2 pl-5 text-base leading-8 text-zinc-400">{block.items.map((item) => <li key={item} className="list-disc marker:text-accent">{item}</li>)}</ul> : <p key={index} className="text-base leading-8 text-zinc-400">{block.items[0]}</p>)}</div>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tournament = await getPublishedTournamentBySlug((await params).slug);
  if (!tournament) return { title: "Không tìm thấy giải đấu | Tiger Esports" };
  const socialImage = tournament.image ?? tournament.video?.poster;
  const description = cleanText(tournament.summaryContent || tournament.description || `${tournament.game} tại ${tournament.branchName ?? "Tiger Esports"}`).slice(0, 160);
  return { title: `${tournament.name} | Tiger Esports`, description, openGraph: { title: tournament.name, description, images: socialImage ? [socialImage.src] : undefined } };
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = await getPublishedTournamentBySlug((await params).slug);
  if (!tournament) notFound();

  const visual = tournament.image ?? tournament.video?.poster;
  const isCompleted = tournament.status === "completed";
  const eventDate = formatDate(tournament.startsAt ?? tournament.heldOn);
  const title = isCompleted && tournament.summaryTitle ? tournament.summaryTitle : tournament.name;
  const lead = cleanText(tournament.description || tournament.summaryContent || "").slice(0, 260);
  const prizes = [
    { label: "Giải Nhất", value: tournament.prizeFirst },
    { label: "Giải Nhì", value: tournament.prizeSecond },
    { label: "Giải Ba", value: tournament.prizeThird },
  ].filter((prize): prize is { label: string; value: string } => Boolean(prize.value));

  return (
    <main className="min-h-dvh bg-ground pb-16">
      <section className="relative overflow-hidden bg-panel">
        {visual ? (
          <div className="absolute inset-0 opacity-45">
            <Image src={visual.src} alt={visual.alt} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ) : <div className="absolute inset-0" />}
        <Container className="relative py-10 sm:py-16 lg:py-24">
          <Link href="/#giai-dau" className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-zinc-300 hover:text-white"><ArrowLeft className="size-4" />Quay lại trang chủ</Link>
          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-[13px] font-bold uppercase text-accent">{tournament.game}</span>
              <span className="rounded-full bg-black/35 px-3 py-1 text-[13px] font-bold text-zinc-300">{statusLabels[tournament.status]}</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">{title}</h1>
            {lead ? <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{lead}</p> : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {tournament.registrationOpen && tournament.registrationUrl ? <a href={tournament.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent text-ground hover:bg-[#c98bff] px-6 text-sm font-bold">Đăng ký ngay</a> : null}
              {isCompleted && tournament.video ? <a href="#recap" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-black/45 px-5 text-sm font-bold text-white hover:bg-accent"><Play className="size-4 fill-current" />Xem recap</a> : null}
              {tournament.facebookPostUrl ? <a href={tournament.facebookPostUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-black/35 px-5 text-sm font-bold text-white"><ExternalLink className="size-4" />Xem bài Facebook</a> : null}
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <article className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white/[0.035] p-5">
              <h2 className="text-sm font-extrabold text-zinc-400">Thông tin giải đấu</h2>
              <dl className="mt-5 space-y-4 text-sm">
                {eventDate ? <div className="flex gap-3"><CalendarDays className="size-5 shrink-0 text-accent" /><div><dt className="text-zinc-400">Thời gian</dt><dd className="font-semibold text-white">{eventDate}</dd></div></div> : null}
                {tournament.branchName ? <div className="flex gap-3"><MapPin className="size-5 shrink-0 text-accent" /><div><dt className="text-zinc-400">Cơ sở</dt><dd className="font-semibold text-white">{tournament.branchName}</dd></div></div> : null}
                {tournament.format ? <div className="flex gap-3"><Swords className="size-5 shrink-0 text-accent" /><div><dt className="text-zinc-400">Thể thức</dt><dd className="font-semibold text-white">{tournament.format}</dd></div></div> : null}
                {tournament.entryFee !== null ? <div className="flex gap-3"><Ticket className="size-5 shrink-0 text-accent" /><div><dt className="text-zinc-400">Lệ phí</dt><dd className="font-semibold text-white">{tournament.entryFee === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(tournament.entryFee)}đ`}</dd></div></div> : null}
                {tournament.prizePool ? <div className="flex gap-3"><Trophy className="size-5 shrink-0 text-accent" /><div><dt className="text-zinc-400">Tổng giải thưởng</dt><dd className="font-semibold text-white">{tournament.prizePool}</dd></div></div> : null}
              </dl>
            </div>
          </aside>

          <div className="space-y-10">
            {visual ? <div className="relative aspect-video overflow-hidden rounded-3xl"><Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 1023px) 100vw, 70vw" className="object-cover" /></div> : null}

            {isCompleted && tournament.summaryContent ? <section><h2 className="text-2xl font-extrabold text-white">Tổng kết giải đấu</h2><div className="mt-4"><EditorialText value={tournament.summaryContent} /></div></section> : null}
            {!isCompleted && tournament.description ? <section><h2 className="text-2xl font-extrabold text-white">Giới thiệu giải đấu</h2><div className="mt-4"><EditorialText value={tournament.description} /></div></section> : null}
            {prizes.length || tournament.prizePool ? <section><h2 className="text-2xl font-extrabold text-white">Cơ cấu giải thưởng</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{prizes.map((prize) => <div key={prize.label} className="rounded-2xl bg-accent/5 p-5"><p className="text-[13px] font-bold text-accent">{prize.label}</p><p className="mt-2 font-extrabold text-white">{prize.value}</p></div>)}</div></section> : null}
            {tournament.rules ? <section><h2 className="text-2xl font-extrabold text-white">Thể lệ</h2><div className="mt-4"><EditorialText value={tournament.rules} /></div></section> : null}

            {tournament.placements.length ? (
              <section>
                <h2 className="text-2xl font-extrabold text-white">Bảng vàng kết quả</h2>
                <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                  {tournament.placements.map((placement) => <li key={placement.position} className="rounded-2xl bg-white/[0.035] p-5"><span className="flex items-center gap-2 text-sm font-bold text-accent"><Medal className="size-4" />{placementLabels[placement.position]}</span><p className="mt-3 text-xl font-extrabold text-white">{placement.displayName}</p></li>)}
                </ol>
              </section>
            ) : null}

            {tournament.highlights.length ? (
              <section>
                <h2 className="text-2xl font-extrabold text-white">Khoảnh khắc nổi bật</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tournament.highlights.map((highlight) => <li key={highlight} className="rounded-2xl bg-black/35 p-5 text-base leading-7 text-zinc-300">{highlight}</li>)}
                </ul>
              </section>
            ) : null}

            {tournament.video ? <section id="recap" className="scroll-mt-24"><h2 className="text-2xl font-extrabold text-white">Video recap</h2><div className="relative mt-5 aspect-video overflow-hidden rounded-3xl"><MediaPreview video={tournament.video} title={`Recap ${tournament.name}`} /></div></section> : null}

            <section className="rounded-3xl bg-accent/5 p-6">
              <h2 className="text-2xl font-extrabold text-white">{isCompleted ? "Theo dõi các giải tiếp theo tại Tiger" : "Sẵn sàng tham gia giải đấu?"}</h2>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {tournament.registrationOpen && tournament.registrationUrl ? <a href={tournament.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent text-ground hover:bg-[#c98bff] px-6 text-sm font-bold">Đăng ký ngay</a> : null}
                {tournament.video ? <a href="#recap" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold text-white hover:bg-accent"><Play className="size-4 fill-current" />Xem recap</a> : null}
                {tournament.facebookPostUrl ? <a href={tournament.facebookPostUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold text-white"><ExternalLink className="size-4" />Bài Facebook</a> : null}
                <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg px-6 text-sm font-bold text-white">Về trang chủ</Link>
              </div>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}
