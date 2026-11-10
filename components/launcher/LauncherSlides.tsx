import Image from "next/image";
import { gameLabel } from "@/lib/games";
import type { LauncherBranch, LauncherData } from "./launcherTypes";
import type { LeaderboardEntry, LeaderboardPeriod, Promotion, TournamentEvent, TournamentStatus } from "@/types";

const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
const shortDate = (value: string | null) => (value ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value)) : null);
const statusLabels: Record<TournamentStatus, string> = { registration_open: "Đang mở đăng ký", ongoing: "Đang diễn ra", upcoming: "Sắp diễn ra", completed: "Đã kết thúc" };
const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;

function Empty({ text }: { text: string }) {
  return <p className="grid h-full place-items-center rounded-2xl bg-panel p-10 text-center text-3xl font-semibold text-zinc-300">{text}</p>;
}

function SlideTitle({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-6">
      <h2 className="font-display text-6xl uppercase text-white neon-text">{children}</h2>
      {hint ? <p className="text-xl text-zinc-300">{hint}</p> : null}
    </div>
  );
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const until = shortDate(promotion.validUntil);
  const tierLines = promotion.tiers.slice(0, 3);
  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl ${promotion.featured ? "neon-box bg-panel" : "bg-panel"}`}>
      {promotion.image ? (
        <div className="relative h-40 shrink-0 bg-ground">
          <Image src={promotion.image.src} alt={promotion.image.alt} fill sizes="40vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {promotion.featured ? <p className="text-lg font-bold uppercase text-accent">Nổi bật</p> : null}
        <h3 className="font-display text-4xl uppercase text-white">{promotion.name}</h3>
        {promotion.price !== null ? <p className="text-4xl font-extrabold text-accent tabular-nums">{money(promotion.price)}</p> : null}
        {tierLines.length ? (
          <ul className="grid gap-1 text-2xl text-white">
            {tierLines.map((tier) => <li key={tier.sortOrder}>Nạp <b className="tabular-nums">{money(tier.payAmount)}</b> nhận <b className="text-accent tabular-nums">{money(tier.receiveAmount)}</b></li>)}
          </ul>
        ) : null}
        <ul className="grid gap-1 text-xl text-zinc-200">
          {promotion.highlights.slice(0, 4).map((line) => <li key={line}>• {line}</li>)}
        </ul>
        {until ? <p className="mt-auto pt-2 text-lg font-semibold text-zinc-300">Áp dụng đến {until}</p> : null}
      </div>
    </article>
  );
}

export function PromotionsSlide({ data }: { data: LauncherData }) {
  const list = [...data.promotions].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);
  const upcoming = data.upcomingPromotions.slice(0, 2);
  return (
    <div className="flex h-full flex-col">
      <SlideTitle hint="Hỏi nhân viên tại quầy để áp dụng">Ưu đãi đang có</SlideTitle>
      {list.length ? (
        <div className="grid min-h-0 flex-1 gap-5 [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]">{list.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />)}</div>
      ) : <Empty text="Chương trình ưu đãi đang được cập nhật" />}
      {upcoming.length ? <p className="mt-5 text-2xl text-zinc-200"><b className="text-accent">Sắp ra mắt:</b> {upcoming.map((item) => item.name).join(" · ")}</p> : null}
    </div>
  );
}

function EventCard({ event, qr }: { event: TournamentEvent; qr: string | undefined }) {
  const fee = event.entryFee === null ? null : event.entryFee === 0 ? "Miễn phí" : money(event.entryFee);
  const when = shortDate(event.startsAt ?? event.heldOn) ?? "Lịch đang cập nhật";
  return (
    <article className="flex gap-6 rounded-2xl bg-panel p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-xl font-bold text-accent">{gameLabel(event.game)} · {statusLabels[event.status]}</p>
        <h3 className="font-display text-4xl uppercase text-white">{event.name}</h3>
        <p className="text-2xl text-zinc-200">{[when, event.branchName, fee ? `Phí ${fee}` : null].filter(Boolean).join(" · ")}</p>
        {event.prizePool ? <p className="text-2xl font-bold text-white">Giải thưởng: <span className="text-accent">{event.prizePool}</span></p> : null}
        {event.format ? <p className="text-xl text-zinc-300">{event.format}</p> : null}
      </div>
      {qr ? (
        <div className="shrink-0 text-center">
          <Image src={qr} alt={`Mã QR đăng ký ${event.name}`} width={150} height={150} unoptimized className="rounded-lg" />
          <p className="mt-2 text-lg font-bold text-white">Quét để đăng ký</p>
        </div>
      ) : null}
    </article>
  );
}

export function TournamentsSlide({ data }: { data: LauncherData }) {
  return (
    <div className="flex h-full flex-col">
      <SlideTitle>Giải đấu</SlideTitle>
      {data.events.length ? <div className="grid content-start gap-4">{data.events.map((event) => <EventCard key={event.id} event={event} qr={data.registrationQr[event.id]} />)}</div> : <Empty text="Chưa có giải mới. Theo dõi fanpage để không bỏ lỡ!" />}
    </div>
  );
}

export function ResultsSlide({ data }: { data: LauncherData }) {
  return (
    <div className="flex h-full flex-col">
      <SlideTitle>Tổng kết giải đấu</SlideTitle>
      {data.completedEvents.length ? (
        <div className="grid content-start gap-4">
          {data.completedEvents.map((event) => (
            <article key={event.id} className="rounded-2xl bg-panel p-6">
              <p className="text-xl font-bold text-accent">{gameLabel(event.game)} · {shortDate(event.heldOn ?? event.startsAt) ?? ""}</p>
              <h3 className="font-display text-4xl uppercase text-white">{event.name}</h3>
              {event.placements.length ? (
                <ol className="mt-4 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]">
                  {event.placements.slice(0, 3).map((placement) => (
                    <li key={placement.position} className={`rounded-xl px-5 py-4 ${placement.position === 1 ? "neon-glow bg-accent text-ground" : "bg-ground text-white"}`}>
                      <span className="block text-lg font-bold uppercase opacity-80">{placementLabels[placement.position]}</span>
                      <span className="text-3xl font-extrabold">{placement.displayName}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {event.summaryContent ? <p className="mt-4 line-clamp-2 text-xl text-zinc-300">{event.summaryContent}</p> : null}
            </article>
          ))}
        </div>
      ) : <Empty text="Kết quả giải đấu sẽ được cập nhật tại đây" />}
    </div>
  );
}

function latestStart(entries: LeaderboardEntry[], period: LeaderboardPeriod) {
  return entries.filter((entry) => entry.period === period).map((entry) => entry.periodStart).sort().at(-1) ?? null;
}

function periodLabel(period: LeaderboardPeriod, periodStart: string) {
  const start = new Date(`${periodStart}T00:00:00Z`);
  if (period === "month") return `Tháng ${String(start.getUTCMonth() + 1).padStart(2, "0")}/${start.getUTCFullYear()}`;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const dm = (date: Date) => `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  return `Tuần ${dm(start)} - ${dm(end)}`;
}

function BranchBoard({ branch, rows }: { branch: LauncherBranch; rows: LeaderboardEntry[] }) {
  return (
    <section className="rounded-2xl bg-panel p-5">
      <h3 className="font-display text-3xl uppercase text-white">{branch.name}</h3>
      <ol className="mt-3 grid gap-2">
        {rows.map((row) => (
          <li key={row.id} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${row.rank === 1 ? "neon-glow bg-accent text-ground" : "bg-ground text-white"}`}>
            <span className="flex min-w-0 items-center gap-3 text-2xl font-bold"><span className="w-6 tabular-nums">{row.rank}</span><span className="truncate">{row.displayName}</span></span>
            <span className="text-xl tabular-nums">{new Intl.NumberFormat("vi-VN").format(row.points)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RankingSlide({ data, cycle }: { data: LauncherData; cycle: number }) {
  const periods = (["week", "month"] as const).filter((period) => latestStart(data.leaderboard, period) !== null);
  const period = periods.length ? periods[cycle % periods.length] : null;
  const periodStart = period ? latestStart(data.leaderboard, period) : null;
  const columns = period && periodStart
    ? data.branches.map((branch) => ({ branch, rows: data.leaderboard.filter((entry) => entry.branchId === branch.id && entry.period === period && entry.periodStart === periodStart).sort((a, b) => a.rank - b.rank).slice(0, 5) })).filter((column) => column.rows.length)
    : [];
  const members = data.members.slice(0, 6);
  return (
    <div className="flex h-full flex-col">
      <SlideTitle hint={period && periodStart ? `${period === "week" ? "Top tuần" : "Top tháng"} · ${periodLabel(period, periodStart)}` : undefined}>Xếp hạng hội viên</SlideTitle>
      {columns.length ? <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(17rem,1fr))]">{columns.map(({ branch, rows }) => <BranchBoard key={branch.id} branch={branch} rows={rows} />)}</div> : <Empty text="Bảng xếp hạng đang được cập nhật" />}
      {members.length ? (
        <div className="mt-5">
          <p className="mb-2 text-xl font-bold uppercase text-accent">Hội viên vinh danh</p>
          <ul className="flex flex-wrap gap-3">
            {members.map((member) => <li key={member.id} className="rounded-xl bg-panel px-5 py-3 text-2xl font-bold text-white">{member.displayName}{member.tier ? <span className="ml-2 text-lg text-accent">{member.tier}</span> : null}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

const steps = ["Quét mã QR và điền biểu mẫu", "Quản lý cơ sở tiếp nhận, xác minh và xử lý", "Tiger liên hệ phản hồi qua số điện thoại hoặc Zalo bạn để lại"];

export function ComplaintSlide({ data }: { data: LauncherData }) {
  return (
    <div className="flex h-full flex-col">
      <SlideTitle>Khiếu nại và góp ý</SlideTitle>
      <div className="grid flex-1 items-center gap-8 [grid-template-columns:1.2fr_1fr]">
        <div>
          <p className="max-w-[28ch] text-balance text-4xl font-bold leading-tight text-white">Trải nghiệm chưa tốt ở Tiger? Hãy cho chúng tôi biết.</p>
          <ol className="mt-6 grid gap-3">
            {steps.map((step, index) => <li key={step} className="flex items-center gap-4 text-2xl text-zinc-100"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-extrabold text-ground">{index + 1}</span>{step}</li>)}
          </ol>
          <p className="mt-6 text-3xl font-extrabold text-white">Cần hỗ trợ gấp? Gọi <span className="text-accent tabular-nums">{data.hotline}</span></p>
        </div>
        <div className="flex justify-center gap-6">
          {data.complaintQr ? <QrBlock src={data.complaintQr} label="Gửi khiếu nại" /> : null}
          {data.zaloQr ? <QrBlock src={data.zaloQr} label="Nhắn Zalo" /> : null}
        </div>
      </div>
    </div>
  );
}

function QrBlock({ src, label }: { src: string; label: string }) {
  return (
    <figure className="text-center">
      <Image src={src} alt={`Mã QR: ${label}`} width={220} height={220} unoptimized className="rounded-xl" />
      <figcaption className="mt-2 text-2xl font-bold text-white">{label}</figcaption>
    </figure>
  );
}
