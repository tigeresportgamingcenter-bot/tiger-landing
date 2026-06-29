import { CalendarDays, MapPin, Play, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TournamentEvent, TournamentStatus } from "@/types";

const statusLabels: Record<TournamentStatus, string> = {
  registration_open: "Đang mở đăng ký",
  ongoing: "Đang diễn ra",
  upcoming: "Sắp diễn ra",
  completed: "Đã kết thúc",
};

function formatDate(value: string | null) {
  if (!value) return "Lịch đang cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function TournamentCard({ event, mode }: { event: TournamentEvent; mode: "upcoming" | "completed" }) {
  const visual = event.image ?? event.video?.poster;
  const detailLabel = mode === "completed" ? "Xem tổng kết" : "Xem chi tiết";

  return (
    <article className="min-w-[84vw] snap-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] sm:min-w-0">
      {visual ? (
        <div className="relative aspect-[16/9]">
          <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 639px) 84vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-tiger-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-300">{event.game}</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold text-zinc-400">{statusLabels[event.status]}</span>
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-white">{event.name}</h3>
        <div className="mt-4 space-y-2 text-xs text-zinc-500">
          <p className="flex items-center gap-2"><CalendarDays className="size-4 text-tiger-orange" />{formatDate(event.startsAt ?? event.heldOn)}</p>
          {event.branchName ? <p className="flex items-center gap-2"><MapPin className="size-4 text-tiger-orange" />{event.branchName}</p> : null}
          {event.entryFee !== null ? <p className="flex items-center gap-2"><Ticket className="size-4 text-tiger-orange" />{event.entryFee === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(event.entryFee)}đ`}</p> : null}
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {mode === "upcoming" && event.registrationOpen && event.registrationUrl ? (
            <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-to-r from-tiger-red to-tiger-orange px-4 text-sm font-bold text-white">Đăng ký ngay</a>
          ) : null}
          <Link href={`/giai-dau/${event.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-bold text-white hover:border-tiger-orange">{detailLabel}</Link>
          {mode === "completed" && event.video ? (
            <Link href={`/giai-dau/${event.slug}#recap`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-tiger-orange/50 px-4 text-sm font-bold text-white hover:bg-tiger-orange">
              <Play className="size-4 fill-current" />Xem recap
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TournamentEventsSection({ events }: { events: TournamentEvent[] }) {
  const visibleEvents = events.filter((event) => event.status !== "completed");
  if (!visibleEvents.length) return null;
  return (
    <section className="section-space bg-black" id="giai-dau">
      <Container>
        <SectionHeading eyebrow="Sự kiện Tiger" title="Giải đấu đang mở đăng ký" description="Theo dõi lịch thi đấu, trạng thái giải và đăng ký trực tiếp với Tiger Esports." />
        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {visibleEvents.map((event) => <TournamentCard key={event.id} event={event} mode="upcoming" />)}
        </div>
        {visibleEvents.length > 1 ? <p className="mt-3 text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</p> : null}
      </Container>
    </section>
  );
}

export function CompletedTournamentsSection({ events }: { events: TournamentEvent[] }) {
  const completedEvents = events.filter((event) => event.status === "completed");
  if (!completedEvents.length) return null;
  return (
    <section className="section-space bg-zinc-950" id="tong-ket-giai-dau">
      <Container>
        <SectionHeading eyebrow="Tổng kết Tiger" title="Giải đấu đã kết thúc" description="Xem lại các giải đã tổ chức, kết quả và video recap nếu đã được cập nhật." />
        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {completedEvents.map((event) => <TournamentCard key={event.id} event={event} mode="completed" />)}
        </div>
        {completedEvents.length > 1 ? <p className="mt-3 text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</p> : null}
      </Container>
    </section>
  );
}
