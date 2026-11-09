import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { LeaderboardBoard } from "@/components/ui/LeaderboardBoard";
import { MediaPreview } from "@/components/ui/MediaPreview";
import { TournamentBoard } from "@/components/ui/TournamentBoard";
import { gameLabel } from "@/lib/games";
import type { Branch, ChampionPlacement, GalleryItem, HallOfFameContent, HonoredMember, LeaderboardEntry, Tournament, TournamentEvent } from "@/types";

const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;
const maxDescriptionLength = 120;
const visibleMemberCount = 3;
const visibleGalleryCount = 4;

function cleanGameDescription(value: string) {
  const withoutEmoji = value.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, " ").trim();
  if (withoutEmoji.length <= maxDescriptionLength) return withoutEmoji;
  return `${withoutEmoji.slice(0, maxDescriptionLength).replace(/\s+\S*$/, "")}...`;
}

interface ResultRow {
  slug: string;
  name: string;
  placements: ChampionPlacement[];
}

function MoreItems({ count, className, children }: { count: number; className: string; children: ReactNode }) {
  if (count <= 0) return null;
  return (
    <details className="group mt-3">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 rounded-lg bg-white/10 text-base font-semibold text-white transition hover:bg-white/20">
        Xem thêm {count}<ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className={`mt-3 ${className}`}>{children}</div>
    </details>
  );
}

function ResultCard({ row }: { row: ResultRow }) {
  return (
    <Link href={`/giai-dau/${row.slug}`} className="rounded-lg bg-panel p-5 transition hover:bg-white/10">
      <p className="text-lg font-bold text-white">{row.name}</p>
      <ol className="mt-2 grid gap-1 text-base text-zinc-300">
        {row.placements.slice(0, 3).map((placement) => <li key={placement.position} className="flex justify-between gap-4"><span className="text-accent">{placementLabels[placement.position]}</span><span>{placement.displayName}</span></li>)}
      </ol>
    </Link>
  );
}

function MemberRow({ member, rank }: { member: HonoredMember; rank: number }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 rounded-lg bg-panel px-5 py-4">
      <span className="text-lg font-bold text-white"><span className="mr-3 text-accent">#{rank}</span>{member.displayName}</span>
      <span className="text-base text-zinc-300">{member.tier} · {new Intl.NumberFormat("vi-VN").format(member.memberPoints)} điểm</span>
    </li>
  );
}

function GalleryFigure({ item }: { item: GalleryItem }) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-panel">
        {item.mediaType === "image" && item.image ? <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1023px) 50vw, 25vw" className="object-cover" /> : item.video ? <MediaPreview video={item.video} title={item.title} /> : null}
      </div>
      <figcaption className="mt-2 text-base text-zinc-300">{item.title}{item.caption ? <span className="block text-[13px] text-zinc-400">{item.caption}</span> : null}</figcaption>
    </figure>
  );
}

interface ArenaSectionProps {
  events: TournamentEvent[];
  completedEvents: TournamentEvent[];
  hallOfFame: HallOfFameContent;
  leaderboard: LeaderboardEntry[];
  branches: Branch[];
  games: Tournament[];
  galleryItems: GalleryItem[];
  communityUrl: string;
}

export function ArenaSection({ events, completedEvents, hallOfFame, leaderboard, branches, games, galleryItems, communityUrl }: ArenaSectionProps) {
  const allEvents = [...events, ...completedEvents];
  const hasLeaderboard = leaderboard.length > 0;

  const archivedResults: ResultRow[] = hallOfFame.tournaments
    .filter((tournament) => tournament.status === "verified" && tournament.showInHallOfFame && tournament.name && tournament.placements.length > 0 && !allEvents.some((event) => event.slug === tournament.slug))
    .map((tournament) => ({ slug: tournament.slug, name: tournament.name ?? "", placements: tournament.placements }));

  const members = hallOfFame.members.filter((member) => member.status === "verified" && member.consentConfirmed && member.displayName && member.tier);
  const gallery = galleryItems.filter((item) => item.image || item.video);

  if (!allEvents.length && !archivedResults.length && !hasLeaderboard && !members.length && !games.length && !gallery.length) return null;

  return (
    <section id="giai-dau" className="bg-ground py-20 sm:py-28">
      <span id="cong-dong" className="block" />
      <span id="tong-ket-giai-dau" className="block" />
      <Container>
        <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">Đấu trường Tiger</h2>
            <p className="mt-4 max-w-[48ch] text-balance text-lg leading-snug text-zinc-300">Giải đấu cho từng tựa game, bảng xếp hạng từng cơ sở và cộng đồng game thủ cùng chơi mỗi ngày.</p>
          </div>
          <ButtonLink href={communityUrl} external variant="secondary" className="self-start lg:self-auto">Theo dõi cộng đồng <ChevronRight className="size-4" /></ButtonLink>
        </div>

        {allEvents.length ? <div className="reveal mt-12"><TournamentBoard events={allEvents} /></div> : null}

        {archivedResults.length ? (
          <div className="reveal mt-16">
            <h3 className="font-display text-4xl uppercase text-white">Nhà vô địch</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{archivedResults.map((row) => <ResultCard key={row.slug} row={row} />)}</div>
          </div>
        ) : null}

        {hasLeaderboard ? (
          <div id="bang-xep-hang" className="reveal mt-20 scroll-mt-24">
            <h3 className="font-display text-5xl uppercase text-white sm:text-6xl">Bảng xếp hạng</h3>
            <p className="mb-8 mt-3 max-w-[52ch] text-lg leading-snug text-zinc-300">Top 5 người chơi của từng cơ sở, cập nhật theo tuần và theo tháng.</p>
            <LeaderboardBoard entries={leaderboard} branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))} />
          </div>
        ) : members.length ? (
          <div id="bang-xep-hang" className="reveal mt-20 scroll-mt-24">
            <h3 className="font-display text-4xl uppercase text-white">Hội viên thân thiết</h3>
            <ol className="mt-4 grid gap-2 lg:max-w-2xl">{members.slice(0, visibleMemberCount).map((member, index) => <MemberRow key={member.id} member={member} rank={index + 1} />)}</ol>
            <div className="lg:max-w-2xl">
              <MoreItems count={members.length - visibleMemberCount} className="grid gap-2">
                <ol className="grid gap-2" start={visibleMemberCount + 1}>{members.slice(visibleMemberCount).map((member, index) => <MemberRow key={member.id} member={member} rank={visibleMemberCount + index + 1} />)}</ol>
              </MoreItems>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-zinc-400">{hallOfFame.consentNotice}</p>
          </div>
        ) : null}

        {games.length ? (
          <div className="reveal mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {games.map((game) => (
              <div key={game.id}>
                <h3 className="font-display text-4xl uppercase text-white">{gameLabel(game.game)}</h3>
                <p className="mt-2 text-base leading-snug text-zinc-400">{cleanGameDescription(game.description)}</p>
              </div>
            ))}
          </div>
        ) : null}

        {gallery.length ? (
          <div className="reveal mt-20">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{gallery.slice(0, visibleGalleryCount).map((item) => <GalleryFigure key={item.id} item={item} />)}</div>
            <MoreItems count={gallery.length - visibleGalleryCount} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {gallery.slice(visibleGalleryCount).map((item) => <GalleryFigure key={item.id} item={item} />)}
            </MoreItems>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
