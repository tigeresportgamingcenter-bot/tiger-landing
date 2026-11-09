"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { gameLabel, supportedGames } from "@/lib/games";
import type { TournamentEvent, TournamentStatus } from "@/types";

type GroupKey = "ongoing" | "upcoming" | "completed";

const groups: Array<{ key: GroupKey; title: string }> = [
  { key: "ongoing", title: "Đang diễn ra" },
  { key: "upcoming", title: "Sắp diễn ra" },
  { key: "completed", title: "Tổng kết giải đấu" },
];

const statusLabels: Record<TournamentStatus, string> = {
  registration_open: "Đang mở đăng ký",
  ongoing: "Đang diễn ra",
  upcoming: "Sắp diễn ra",
  completed: "Đã kết thúc",
};

const placementLabels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;
const visibleCompletedCount = 3;

const groupOf = (status: TournamentStatus): GroupKey => status === "ongoing" ? "ongoing" : status === "completed" ? "completed" : "upcoming";
const dateOf = (event: TournamentEvent) => event.startsAt ?? event.heldOn ?? "";

function formatDate(value: string | null) {
  if (!value) return "Lịch đang cập nhật";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

function sortGroup(key: GroupKey, events: TournamentEvent[]) {
  const sorted = [...events];
  if (key === "completed") return sorted.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  return sorted.sort((a, b) => (dateOf(a) || "9999").localeCompare(dateOf(b) || "9999"));
}

function EventCard({ event }: { event: TournamentEvent }) {
  const visual = event.image ?? event.video?.poster ?? null;
  const isCompleted = event.status === "completed";
  const fee = event.entryFee === null ? null : event.entryFee === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(event.entryFee)}đ`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-panel">
      <div className="relative aspect-[2/1] overflow-hidden bg-ground sm:aspect-[16/10]">
        {visual ? <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-base font-semibold text-accent">{gameLabel(event.game)} · {statusLabels[event.status]}</p>
        <h4 className="mt-1 text-xl font-extrabold leading-tight text-white">{event.name}</h4>
        <p className="mt-2 text-base text-zinc-300">{[formatDate(event.startsAt ?? event.heldOn), event.branchName, fee].filter(Boolean).join(" · ")}</p>
        {isCompleted && event.placements.length > 0 ? (
          <ol className="mt-3 grid gap-1 text-base text-zinc-300">
            {event.placements.slice(0, 3).map((placement) => <li key={placement.position} className="flex justify-between gap-4"><span className="text-accent">{placementLabels[placement.position]}</span><span>{placement.displayName}</span></li>)}
          </ol>
        ) : null}
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          {!isCompleted && event.registrationOpen && event.registrationUrl ? <ButtonLink href={event.registrationUrl} external className="flex-1 !px-4">Đăng ký</ButtonLink> : null}
          <ButtonLink href={`/giai-dau/${event.slug}`} variant="secondary" className="flex-1 !px-4">{isCompleted ? "Xem tổng kết" : "Chi tiết"}</ButtonLink>
          {isCompleted && event.video ? (
            <Link href={`/giai-dau/${event.slug}#recap`} className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/20"><Play className="size-4 fill-current" />Recap</Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TournamentBoard({ events }: { events: TournamentEvent[] }) {
  const [game, setGame] = useState<string>("all");
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const presentGames = [...new Set(events.map((event) => event.game))].sort((a, b) => {
    const indexA = supportedGames.indexOf(a);
    const indexB = supportedGames.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });
  const visibleEvents = game === "all" ? events : events.filter((event) => event.game === game);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc giải đấu theo game">
        {["all", ...presentGames].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={game === item}
            onClick={() => { setGame(item); setShowAllCompleted(false); }}
            className={`press min-h-12 rounded-lg px-5 text-base font-semibold transition ${game === item ? "bg-paper text-ground" : "bg-panel text-white hover:bg-white/10"}`}
          >
            {item === "all" ? "Tất cả game" : gameLabel(item)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-12">
        {groups.map(({ key, title }) => {
          const items = sortGroup(key, visibleEvents.filter((event) => groupOf(event.status) === key));
          if (!items.length) return null;
          const shown = key === "completed" && !showAllCompleted ? items.slice(0, visibleCompletedCount) : items;
          return (
            <div key={key}>
              <h3 className="flex items-center gap-3 font-display text-4xl uppercase text-white sm:text-5xl">
                {key === "ongoing" ? <span className="size-3 rounded-full bg-accent" aria-hidden="true" /> : null}
                {title}
                <span className="text-xl text-zinc-400">{items.length}</span>
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
              {key === "completed" && items.length > visibleCompletedCount ? (
                <button type="button" onClick={() => setShowAllCompleted((value) => !value)} className="press mt-4 min-h-12 rounded-lg bg-white/10 px-6 text-base font-semibold text-white transition hover:bg-white/20">
                  {showAllCompleted ? "Thu gọn" : `Xem thêm ${items.length - visibleCompletedCount} giải đã kết thúc`}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
