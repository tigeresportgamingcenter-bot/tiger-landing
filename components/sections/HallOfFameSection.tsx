import { CalendarDays, ChevronRight, Crown, MapPin, Medal, Trophy, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HallOfFameContent, HallOfFameTournament, HonoredMember } from "@/types";

const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function TournamentCard({ tournament }: { tournament: HallOfFameTournament }) {
  const isReady = tournament.status === "verified" && tournament.name && tournament.heldOn && tournament.branchName;
  if (!isReady) {
    return (
      <article className="min-w-[82vw] snap-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-6 sm:min-w-0">
        <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{tournament.game}</span>
        <Trophy className="mt-8 size-8 text-zinc-700" />
        <h4 className="mt-4 text-lg font-bold text-zinc-300">Đang cập nhật</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-600">Kết quả chỉ hiển thị sau khi được Tiger Esports xác minh.</p>
      </article>
    );
  }

  const visual = tournament.image ?? tournament.video?.poster;
  return (
    <article className="relative min-w-[82vw] snap-center overflow-hidden rounded-2xl border border-tiger-orange/30 bg-white/[0.035] transition hover:border-tiger-orange sm:min-w-0">
      <Link href={`/giai-dau/${tournament.id}`} aria-label={`Xem chi tiết ${tournament.name}`} className="absolute inset-0 z-[1]" />
      {visual ? <div className="relative aspect-[16/9]"><Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 639px) 82vw, 36vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" /></div> : null}
      <div className="p-6">
        <span className="inline-flex rounded-full bg-tiger-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-300">{tournament.game}</span>
        <h4 className="mt-4 text-xl font-extrabold text-white">{tournament.name}</h4>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(tournament.heldOn!)}</span><span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{tournament.branchName}</span></div>
        {tournament.placements.length > 0 ? <ol className="mt-5 space-y-2">{tournament.placements.slice(0, 3).map((placement) => <li key={placement.position} className="flex items-center justify-between rounded-lg bg-black/35 px-3 py-2.5"><span className="flex items-center gap-2 text-xs font-bold text-orange-300"><Medal className="size-4" />{placementLabels[placement.position]}</span><span className="text-sm font-semibold text-zinc-200">{placement.displayName}</span></li>)}</ol> : null}
        {tournament.video ? <Link href={`/giai-dau/${tournament.id}#recap`} className="relative z-[2] mt-5 inline-flex min-h-12 items-center justify-center rounded-lg border border-tiger-orange/50 px-4 text-sm font-bold text-white hover:bg-tiger-orange">Xem recap</Link> : null}
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: HonoredMember }) {
  const isReady = member.status === "verified" && member.consentConfirmed && member.displayName && member.tier;
  if (!isReady) {
    return (
      <article className="min-w-[82vw] snap-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-6 sm:min-w-0">
        <UserRoundCheck className="size-8 text-zinc-700" />
        <h4 className="mt-4 text-lg font-bold text-zinc-300">Đang cập nhật</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-600">Chỉ đăng nickname rút gọn khi hội viên đã đồng ý.</p>
      </article>
    );
  }

  return (
    <article className="min-w-[82vw] snap-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:min-w-0">
      <div className="flex items-center gap-4">
        {member.image ? <div className="relative size-16 shrink-0 overflow-hidden rounded-xl"><Image src={member.image.src} alt={member.image.alt} fill sizes="64px" className="object-cover" /></div> : <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-white/5"><Crown className="size-7 text-tiger-orange" /></span>}
        <div><span className="text-[10px] font-bold uppercase tracking-widest text-tiger-orange">{member.tier}</span><h4 className="mt-1 text-lg font-extrabold text-white">{member.displayName}</h4>{member.periodLabel ? <p className="mt-1 text-xs text-zinc-500">{member.periodLabel}</p> : null}</div>
      </div>
    </article>
  );
}

interface HallOfFameSectionProps {
  content: HallOfFameContent;
  communityUrl: string;
}

export function HallOfFameSection({ content, communityUrl }: HallOfFameSectionProps) {
  const verifiedTournaments = content.tournaments.filter((tournament) => tournament.status === "verified");
  const hasPendingTournaments = content.tournaments.some((tournament) => tournament.status === "placeholder");
  const visibleMembers = content.members.filter((member) => member.status === "verified" && member.consentConfirmed);

  return (
    <section className="section-space bg-black" aria-labelledby="hall-of-fame-title">
      <Container>
        <div id="hall-of-fame-title"><SectionHeading eyebrow="Hall of Fame" title="Dấu ấn cộng đồng Tiger" description="Nơi ghi nhận thành tích giải đấu và những hội viên đã đồng ý xuất hiện trên bảng vàng Tiger Esports." /></div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold text-white">Vinh danh nhà vô địch</h3>{verifiedTournaments.length > 1 ? <span className="text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</span> : null}</div>
            {verifiedTournaments.length > 0 ? <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">{verifiedTournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}</div> : null}
            {hasPendingTournaments ? <p className="mt-4 text-sm text-zinc-600">Các giải đấu tiếp theo đang được cập nhật.</p> : null}
          </div>
          <div>
            <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold text-white">Hội viên thân thiết</h3>{visibleMembers.length > 1 ? <span className="text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</span> : null}</div>
            {visibleMembers.length > 0 ? <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:overflow-visible sm:px-0">{visibleMembers.map((member) => <MemberCard key={member.id} member={member} />)}</div> : null}
            <p className="mt-4 text-xs leading-5 text-zinc-600">{content.consentNotice}</p>
          </div>
        </div>
        <a href={communityUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg border border-tiger-orange/50 px-5 text-sm font-bold text-white transition hover:bg-tiger-orange">Theo dõi cộng đồng Tiger <ChevronRight className="size-4" /></a>
      </Container>
    </section>
  );
}
