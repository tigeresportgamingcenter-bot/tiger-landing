import { CalendarDays, ChevronRight, Crown, MapPin, Medal, Play, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HallOfFameContent, HallOfFameTournament, HonoredMember } from "@/types";

const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;

function formatDate(value: string | null) {
  if (!value) return "Ngày đang cập nhật";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

function TournamentCard({ tournament }: { tournament: HallOfFameTournament }) {
  const visual = tournament.image ?? tournament.video?.poster;
  return (
    <article className="relative min-w-[82vw] snap-center overflow-hidden rounded-2xl border border-tiger-orange/30 bg-white/[0.035] transition hover:border-tiger-orange sm:min-w-0">
      <Link href={`/giai-dau/${tournament.slug}`} aria-label={`Xem tổng kết ${tournament.name ?? "giải đấu"}`} className="absolute inset-0 z-[1]" />
      {visual ? (
        <div className="relative aspect-[16/9]">
          <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 639px) 82vw, 36vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        </div>
      ) : null}
      <div className="p-6">
        <span className="inline-flex rounded-full bg-tiger-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-300">{tournament.game}</span>
        <h4 className="mt-4 text-xl font-extrabold text-white">{tournament.name}</h4>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(tournament.heldOn)}</span>
          {tournament.branchName ? <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{tournament.branchName}</span> : null}
        </div>
        {tournament.placements.length > 0 ? (
          <ol className="mt-5 space-y-2">
            {tournament.placements.slice(0, 3).map((placement) => (
              <li key={placement.position} className="flex items-center justify-between rounded-lg bg-black/35 px-3 py-2.5">
                <span className="flex items-center gap-2 text-xs font-bold text-orange-300"><Medal className="size-4" />{placementLabels[placement.position]}</span>
                <span className="text-sm font-semibold text-zinc-200">{placement.displayName}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <div className="relative z-[2] mt-5 flex flex-wrap gap-2">
          <Link href={`/giai-dau/${tournament.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-bold text-white hover:border-tiger-orange">Xem tổng kết</Link>
          {tournament.video ? (
            <Link href={`/giai-dau/${tournament.slug}#recap`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-tiger-orange/50 px-4 text-sm font-bold text-white hover:bg-tiger-orange">
              <Play className="size-4 fill-current" />Xem recap
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: HonoredMember }) {
  return (
    <article className="min-w-[82vw] snap-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:min-w-0">
      <div className="flex items-center gap-4">
        {member.image ? <div className="relative size-16 shrink-0 overflow-hidden rounded-xl"><Image src={member.image.src} alt={member.image.alt} fill sizes="64px" className="object-cover" /></div> : <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-white/5"><Crown className="size-7 text-tiger-orange" /></span>}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tiger-orange">{member.tier}</span>
          <h4 className="mt-1 text-lg font-extrabold text-white">{member.displayName}</h4>
          {member.periodLabel ? <p className="mt-1 text-xs text-zinc-500">{member.periodLabel}</p> : null}
        </div>
      </div>
    </article>
  );
}

interface HallOfFameSectionProps {
  content: HallOfFameContent;
  communityUrl: string;
}

export function HallOfFameSection({ content, communityUrl }: HallOfFameSectionProps) {
  const visibleTournaments = content.tournaments.filter((tournament) => tournament.status === "verified" && tournament.showInHallOfFame && tournament.name);
  const visibleMembers = content.members.filter((member) => member.status === "verified" && member.consentConfirmed && member.displayName && member.tier);

  if (!visibleTournaments.length && !visibleMembers.length) return null;

  return (
    <section className="section-space bg-black" aria-labelledby="hall-of-fame-title">
      <Container>
        <div id="hall-of-fame-title">
          <SectionHeading eyebrow="Hall of Fame" title="Vinh danh nhà vô địch" description="Chỉ những giải đấu hoặc hội viên được Tiger chọn vinh danh mới xuất hiện tại khu vực này." />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          {visibleTournaments.length ? (
            <div>
              <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold text-white">Vinh danh nhà vô địch</h3>{visibleTournaments.length > 1 ? <span className="text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</span> : null}</div>
              <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                {visibleTournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}
              </div>
            </div>
          ) : null}
          {visibleMembers.length ? (
            <div>
              <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold text-white">Hội viên thân thiết</h3>{visibleMembers.length > 1 ? <span className="text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</span> : null}</div>
              <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:overflow-visible sm:px-0">
                {visibleMembers.map((member) => <MemberCard key={member.id} member={member} />)}
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-600">{content.consentNotice}</p>
            </div>
          ) : null}
        </div>
        <a href={communityUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg border border-tiger-orange/50 px-5 text-sm font-bold text-white transition hover:bg-tiger-orange">Theo dõi cộng đồng Tiger <ChevronRight className="size-4" /></a>
        {!visibleMembers.length ? <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-zinc-600"><UserRoundCheck className="size-4" />{content.consentNotice}</p> : null}
      </Container>
    </section>
  );
}
