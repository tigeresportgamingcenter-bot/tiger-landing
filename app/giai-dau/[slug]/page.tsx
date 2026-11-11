import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, ExternalLink, FileText, Gamepad2, Gift, ListChecks, MapPin, Medal, Play, Sparkles, Swords, Ticket, Trophy, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Countdown } from "@/components/ui/Countdown";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { FadeImage } from "@/components/ui/FadeImage";
import { RegisterButton } from "@/components/ui/RegisterButton";
import { PointerEffects } from "@/components/ui/PointerEffects";
import { RippleEffect } from "@/components/ui/RippleEffect";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { MediaPreview } from "@/components/ui/MediaPreview";
import { EditorialText, cleanText } from "@/components/tournament/EditorialText";
import { HighlightList } from "@/components/tournament/HighlightList";
import { Money } from "@/components/tournament/Money";
import { PlacementPodium } from "@/components/tournament/PlacementPodium";
import { PrizeCards } from "@/components/tournament/PrizeCards";
import { SectionHeading } from "@/components/tournament/SectionHeading";
import { StatTiles, type StatTile } from "@/components/tournament/StatTiles";
import { gameLabel } from "@/lib/games";
import { isRegistrationClosed, pickCountdown } from "@/lib/registration";
import { getPublishedTournamentBySlug } from "@/services/contentService";
import type { TournamentStatus } from "@/types";

export const revalidate = 60;

const statusLabels: Record<TournamentStatus, string> = {
  upcoming: "Sắp diễn ra",
  registration_open: "Đang mở đăng ký",
  ongoing: "Đang diễn ra",
  completed: "Đã kết thúc",
};

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
  const description = cleanText(tournament.summaryContent || tournament.description || `${tournament.game} tại ${tournament.branchName ?? "Tiger Esports"}`).slice(0, 160);
  return { title: `${tournament.name} | Tiger Esports`, description, openGraph: { title: tournament.name, description, images: socialImage ? [socialImage.src] : undefined } };
}

const delay = (index: number) => ({ "--i": index }) as CSSProperties;

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = await getPublishedTournamentBySlug((await params).slug);
  if (!tournament) notFound();

  const visual = tournament.image ?? tournament.video?.poster;
  const isCompleted = tournament.status === "completed";
  const isLive = tournament.status === "ongoing" || tournament.status === "registration_open";
  const eventDate = formatDate(tournament.startsAt ?? tournament.heldOn);
  const title = isCompleted && tournament.summaryTitle ? tournament.summaryTitle : tournament.name;
  const lead = cleanText(tournament.description || tournament.summaryContent || "").slice(0, 260);
  const registrationUrl = tournament.registrationOpen ? tournament.registrationUrl : null;
  const registrationClosed = isRegistrationClosed(tournament);
  const countdown = pickCountdown(tournament);
  const fee = tournament.entryFee === null ? null : tournament.entryFee === 0 ? "Miễn phí" : <><CountUp value={tournament.entryFee} />đ</>;
  const prizes = [
    { label: "Giải Nhất", value: tournament.prizeFirst },
    { label: "Giải Nhì", value: tournament.prizeSecond },
    { label: "Giải Ba", value: tournament.prizeThird },
  ].filter((prize): prize is { label: string; value: string } => Boolean(prize.value));

  const tileCandidates: Array<StatTile | null> = [
    eventDate ? { icon: CalendarDays, label: "Thời gian", value: eventDate } : null,
    tournament.branchName ? { icon: MapPin, label: "Cơ sở", value: tournament.branchName } : null,
    fee ? { icon: Ticket, label: "Lệ phí", value: fee } : null,
    tournament.prizePool ? { icon: Trophy, label: "Tổng giải thưởng", value: <Money value={tournament.prizePool} /> } : null,
  ];
  const tiles = tileCandidates.filter((tile): tile is StatTile => tile !== null);

  const factCandidates: Array<StatTile | null> = [
    eventDate ? { icon: CalendarDays, label: "Thời gian", value: eventDate } : null,
    tournament.branchName ? { icon: MapPin, label: "Cơ sở", value: tournament.branchName } : null,
    tournament.format ? { icon: Swords, label: "Thể thức", value: tournament.format } : null,
    fee ? { icon: Ticket, label: "Lệ phí", value: fee } : null,
    tournament.prizePool ? { icon: Trophy, label: "Tổng giải thưởng", value: <Money value={tournament.prizePool} /> } : null,
  ];
  const facts = factCandidates.filter((fact): fact is StatTile => fact !== null);

  return (
    <main className="min-h-dvh bg-ground pb-16">
      <PointerEffects />
      <RippleEffect />
      <section className="relative overflow-hidden bg-panel">
        {visual ? (
          <div className="hero-parallax absolute inset-x-0 -top-[16%] h-[116%]">
            <div style={{ viewTransitionName: `tour-${tournament.slug}` }} className="absolute inset-0 opacity-45">
              <Image src={visual.src} alt={visual.alt} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/70" />
            </div>
          </div>
        ) : <div className="absolute inset-0" />}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(10_6_18/0.75)_100%)]" />
        <Container className="relative py-10 sm:py-16 lg:py-24">
          <Link href="/giai-dau" className="group inline-flex min-h-12 items-center gap-2 text-sm font-bold text-zinc-300 transition-colors hover:text-white"><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />Quay lại trang chủ</Link>
          <div className="mt-8 max-w-4xl">
            <div className="enter flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-[13px] font-bold uppercase text-accent ring-1 ring-accent/40"><Gamepad2 className="size-4" aria-hidden="true" />{gameLabel(tournament.game)}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[13px] font-bold text-zinc-200 ring-1 ring-white/10">
                {isLive ? <span className="relative flex size-2" aria-hidden="true"><span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" /><span className="relative size-2 rounded-full bg-emerald-400" /></span> : null}
                {statusLabels[tournament.status]}
              </span>
              {tournament.status === "ongoing" ? <LiveBadge /> : null}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl"><span className="line-mask"><span className="line-rise" style={{ "--d": "80ms" } as CSSProperties}>{title}</span></span></h1>
            {lead ? <p className="enter mt-6 max-w-3xl text-lg leading-8 text-zinc-300" style={delay(2)}>{lead}</p> : null}
            {countdown ? <div className="enter mt-8" style={delay(3)}><Countdown startsAt={countdown.at} large label={countdown.label} pastLabel={countdown.pastLabel} /></div> : null}
            <div className="enter mt-8 flex flex-col gap-3 sm:flex-row" style={delay(3)}>
              {registrationUrl ? <RegisterButton href={registrationUrl} closesAt={tournament.registrationClosesAt} initialClosed={registrationClosed} pulse>Đăng ký ngay</RegisterButton> : null}
              {isCompleted && tournament.video ? <ButtonLink href="#recap" variant="secondary"><Play className="size-4 fill-current" />Xem recap</ButtonLink> : null}
              {tournament.facebookPostUrl ? <ButtonLink href={tournament.facebookPostUrl} external variant="secondary"><ExternalLink className="size-4" />Xem bài Facebook</ButtonLink> : null}
            </div>
          </div>
          <StatTiles tiles={tiles} />
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <article className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="reveal-left rounded-2xl bg-white/[0.035] p-5 ring-1 ring-white/10">
              <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-zinc-400"><span className="size-2 bg-accent" aria-hidden="true" />Thông tin giải đấu</h2>
              <dl className="mt-4 divide-y divide-white/10">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/40" aria-hidden="true"><Icon className="size-5" /></span>
                    <div><dt className="text-sm text-zinc-400">{label}</dt><dd className="text-base font-semibold tabular-nums text-white">{value}</dd></div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          <div className="space-y-12">
            {visual ? <div className="reveal-clip relative aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10"><FadeImage src={visual.src} alt={visual.alt} fill sizes="(max-width: 1023px) 100vw, 70vw" className="object-cover" /></div> : null}

            {isCompleted && tournament.summaryContent ? <section className="reveal"><SectionHeading icon={FileText}>Tổng kết giải đấu</SectionHeading><div className="mt-6"><EditorialText value={tournament.summaryContent} /></div></section> : null}
            {!isCompleted && tournament.description ? <section className="reveal"><SectionHeading icon={FileText}>Giới thiệu giải đấu</SectionHeading><div className="mt-6"><EditorialText value={tournament.description} /></div></section> : null}
            {prizes.length || tournament.prizePool ? <section className="reveal"><SectionHeading icon={Gift}>Cơ cấu giải thưởng</SectionHeading><PrizeCards prizes={prizes} pool={tournament.prizePool} /></section> : null}
            {tournament.rules ? <section className="reveal"><SectionHeading icon={ListChecks}>Thể lệ</SectionHeading><div className="mt-6"><EditorialText value={tournament.rules} /></div></section> : null}
            {tournament.placements.length ? <section className="reveal"><SectionHeading icon={Medal}>Bảng vàng kết quả</SectionHeading><PlacementPodium placements={tournament.placements} /></section> : null}
            {tournament.highlights.length ? <section className="reveal"><SectionHeading icon={Sparkles}>Khoảnh khắc nổi bật</SectionHeading><HighlightList items={tournament.highlights} /></section> : null}
            {tournament.video ? <section className="reveal"><SectionHeading icon={Video} id="recap">Video recap</SectionHeading><div className="relative mt-6 aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10"><MediaPreview video={tournament.video} title={`Recap ${tournament.name}`} /></div></section> : null}

            <section className="reveal-scale rounded-3xl bg-gradient-to-br from-accent/15 to-transparent p-6 ring-1 ring-accent/30 sm:p-8">
              <h2 className="text-2xl font-extrabold text-white">{isCompleted ? "Theo dõi các giải tiếp theo tại Tiger" : "Sẵn sàng tham gia giải đấu?"}</h2>
              {countdown ? <div className="mt-5"><Countdown startsAt={countdown.at} large label={countdown.label} pastLabel={countdown.pastLabel} /></div> : null}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {registrationUrl ? <RegisterButton href={registrationUrl} closesAt={tournament.registrationClosesAt} initialClosed={registrationClosed}>Đăng ký ngay</RegisterButton> : null}
                {tournament.video ? <ButtonLink href="#recap" variant="secondary"><Play className="size-4 fill-current" />Xem recap</ButtonLink> : null}
                {tournament.facebookPostUrl ? <ButtonLink href={tournament.facebookPostUrl} external variant="secondary"><ExternalLink className="size-4" />Bài Facebook</ButtonLink> : null}
                <ButtonLink href="/" variant="secondary">Về trang chủ</ButtonLink>
              </div>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}
