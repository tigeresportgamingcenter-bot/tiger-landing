import Image from "next/image";
import type { HonoredMember, LeaderboardEntry, LeaderboardPeriod, MemberTier } from "@/types";
import type { LauncherBranch, LauncherData } from "./launcherTypes";
import { Empty, SlideTitle, rise } from "./slideKit";

const tierStyle: Record<MemberTier, string> = {
  Diamond: "bg-white text-ground",
  Platinum: "bg-zinc-300 text-ground",
  Gold: "bg-accent text-ground",
};

function latestStart(entries: LeaderboardEntry[], period: LeaderboardPeriod) {
  return entries.filter((entry) => entry.period === period).map((entry) => entry.periodStart).sort().at(-1) ?? null;
}

function periodLabel(period: LeaderboardPeriod, periodStart: string) {
  const start = new Date(`${periodStart}T00:00:00Z`);
  if (period === "month") return `Top tháng ${String(start.getUTCMonth() + 1).padStart(2, "0")}/${start.getUTCFullYear()}`;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const dm = (date: Date) => `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `Top tuần ${dm(start)} - ${dm(end)}`;
}

const points = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

function BranchBoard({ branch, rows, step }: { branch: LauncherBranch; rows: LeaderboardEntry[]; step: number }) {
  const [first, ...rest] = rows;
  return (
    <section className="rise flex min-w-0 flex-col gap-2" style={rise(step)}>
      <h3 className="mb-1 font-display text-[2.5rem] uppercase text-white">{branch.name}</h3>
      <div className="bg-accent p-6 text-ground">
        <p className="font-display text-[5rem] leading-none">1</p>
        <p className="mt-3 truncate text-[2.25rem] font-extrabold">{first.displayName}</p>
        <p className="text-[1.75rem] font-bold tabular-nums">{points(first.points)} điểm</p>
      </div>
      {rest.map((row) => (
        <div key={row.id} className="flex items-center gap-4 bg-panel px-5 py-3 text-white">
          <span className="w-8 text-[2rem] font-extrabold text-accent tabular-nums">{row.rank}</span>
          <span className="min-w-0 flex-1 truncate text-[1.75rem] font-bold">{row.displayName}</span>
          <span className="text-[1.5rem] text-zinc-300 tabular-nums">{points(row.points)}</span>
        </div>
      ))}
    </section>
  );
}

function MemberTile({ member, rank, step }: { member: HonoredMember; rank: number; step: number }) {
  return (
    <li className="rise flex min-w-0 flex-col bg-panel" style={rise(step)}>
      {member.image ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ground"><Image src={member.image.src} alt={member.image.alt} fill sizes="25vw" className="object-cover" /></div>
      ) : <div className="grid aspect-[4/3] w-full place-items-center bg-white/10 font-display text-[7rem] text-accent">{(member.displayName ?? "?").slice(0, 1)}</div>}
      <div className="flex items-center gap-4 p-5">
        <span className="font-display text-[5rem] leading-none text-accent">{rank}</span>
        <div className="min-w-0">
          <p className="truncate text-[2rem] font-extrabold leading-tight text-white">{member.displayName}</p>
          <p className="mt-1 flex items-center gap-3 text-[1.5rem] text-zinc-300 tabular-nums">
            {member.tier ? <span className={`px-3 py-0.5 text-[1.25rem] font-extrabold ${tierStyle[member.tier]}`}>{member.tier}</span> : null}
            {member.memberPoints > 0 ? `${points(member.memberPoints)} điểm` : null}
          </p>
        </div>
      </div>
    </li>
  );
}

function MemberChips({ members, startRank }: { members: HonoredMember[]; startRank: number }) {
  return (
    <ul className="rise flex flex-wrap gap-3" style={rise(5)}>
      {members.map((member, index) => (
        <li key={member.id} className="flex items-center gap-3 bg-panel py-2 pl-4 pr-2 text-[1.75rem] font-bold text-white">
          <span className="text-accent tabular-nums">{startRank + index}</span>{member.displayName}
          {member.tier ? <span className={`px-3 py-1 text-[1.25rem] font-extrabold ${tierStyle[member.tier]}`}>{member.tier}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function RankingSlide({ data, cycle }: { data: LauncherData; cycle: number }) {
  const periods = (["week", "month"] as const).filter((period) => latestStart(data.leaderboard, period) !== null);
  const period = periods.length ? periods[cycle % periods.length] : null;
  const periodStart = period ? latestStart(data.leaderboard, period) : null;
  const columns = period && periodStart
    ? data.branches.map((branch) => ({ branch, rows: data.leaderboard.filter((entry) => entry.branchId === branch.id && entry.period === period && entry.periodStart === periodStart).sort((a, b) => a.rank - b.rank).slice(0, 5) })).filter((column) => column.rows.length)
    : [];
  const members = data.members.slice(0, 8);

  return (
    <div className="flex h-full flex-col gap-6">
      <SlideTitle aside={period && periodStart ? periodLabel(period, periodStart) : undefined}>Xếp hạng hội viên</SlideTitle>
      {columns.length ? (
        <div className="grid min-h-0 flex-1 content-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(22rem,1fr))]">
          {columns.map(({ branch, rows }, index) => <BranchBoard key={branch.id} branch={branch} rows={rows} step={index + 1} />)}
        </div>
      ) : !members.length ? <Empty text="Bảng xếp hạng đang được cập nhật" /> : null}
      {members.length && !columns.length ? (
        <>
          <ul className="grid gap-5 [grid-template-columns:repeat(4,minmax(0,1fr))]">
            {members.slice(0, 4).map((member, index) => <MemberTile key={member.id} member={member} rank={index + 1} step={index + 1} />)}
          </ul>
          <MemberChips members={members.slice(4)} startRank={5} />
        </>
      ) : null}
      {members.length && columns.length ? (
        <div className="mt-auto">
          <p className="mb-3 text-[1.75rem] font-extrabold text-accent">Hội viên vinh danh</p>
          <MemberChips members={members} startRank={1} />
        </div>
      ) : null}
    </div>
  );
}
