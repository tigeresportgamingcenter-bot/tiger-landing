"use client";

import { useState } from "react";
import type { LeaderboardEntry, LeaderboardPeriod } from "@/types";

interface BranchRef {
  id: string;
  name: string;
}

const periods: Array<{ key: LeaderboardPeriod; label: string }> = [
  { key: "week", label: "Top tuần" },
  { key: "month", label: "Top tháng" },
];

function dayMonth(date: Date) {
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function periodLabel(period: LeaderboardPeriod, periodStart: string) {
  const start = new Date(`${periodStart}T00:00:00Z`);
  if (period === "month") return `Tháng ${String(start.getUTCMonth() + 1).padStart(2, "0")}/${start.getUTCFullYear()}`;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return `Tuần ${dayMonth(start)} đến ${dayMonth(end)}`;
}

export function LeaderboardBoard({ entries, branches }: { entries: LeaderboardEntry[]; branches: BranchRef[] }) {
  const latest = (period: LeaderboardPeriod) => entries.filter((entry) => entry.period === period).map((entry) => entry.periodStart).sort().at(-1) ?? null;
  const available = periods.filter(({ key }) => latest(key) !== null);
  const [active, setActive] = useState<LeaderboardPeriod>(available[0]?.key ?? "week");

  if (!available.length) return null;
  const current = available.some(({ key }) => key === active) ? active : available[0].key;
  const periodStart = latest(current);
  if (!periodStart) return null;

  const columns = branches
    .map((branch) => ({ branch, rows: entries.filter((entry) => entry.branchId === branch.id && entry.period === current && entry.periodStart === periodStart).sort((a, b) => a.rank - b.rank).slice(0, 5) }))
    .filter((column) => column.rows.length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Kỳ xếp hạng">
          {available.map(({ key, label }) => (
            <button key={key} type="button" role="tab" aria-selected={current === key} onClick={() => setActive(key)} className={`press min-h-12 rounded-lg px-5 text-base font-semibold transition ${current === key ? "bg-accent text-ground" : "bg-panel text-white hover:bg-white/10"}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-lg font-semibold text-zinc-200">{periodLabel(current, periodStart)}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="tabpanel">
        {columns.map(({ branch, rows }) => (
          <section key={branch.id} className="rounded-lg bg-panel p-5">
            <h4 className="font-display text-3xl uppercase text-white">{branch.name}</h4>
            <ol className="mt-4 grid gap-2">
              {rows.map((row) => (
                <li key={row.id} className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 ${row.rank === 1 ? "neon-glow bg-accent text-ground" : "bg-ground text-white"}`}>
                  <span className="flex items-center gap-3 text-lg font-bold"><span className="w-5 tabular-nums">{row.rank}</span>{row.displayName}</span>
                  <span className={`text-base tabular-nums ${row.rank === 1 ? "font-bold" : "text-zinc-300"}`}>{new Intl.NumberFormat("vi-VN").format(row.points)}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
