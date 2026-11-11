import { Crown, Medal } from "lucide-react";
import type { CSSProperties } from "react";
import type { ChampionPlacement } from "@/types";

const labels = { 1: "Top 1", 2: "Top 2", 3: "Top 3" } as const;
const tones = {
  1: { text: "text-amber-300", ring: "ring-amber-300/60" },
  2: { text: "text-zinc-200", ring: "ring-zinc-300/40" },
  3: { text: "text-orange-300", ring: "ring-orange-400/40" },
} as const;

/** Winners as a podium: Top 1 in the middle and taller on wide screens, stacked on phones. */
export function PlacementPodium({ placements }: { placements: ChampionPlacement[] }) {
  const sorted = [...placements].sort((a, b) => a.position - b.position);
  return (
    <ol className="mt-6 grid items-end gap-3 sm:grid-cols-3">
      {sorted.map((placement, index) => {
        const tone = tones[placement.position];
        const first = placement.position === 1;
        return (
          <li
            key={placement.position}
            style={{ "--i": index } as CSSProperties}
            className={`card-lift stagger-item rounded-2xl bg-white/[0.04] p-5 ring-1 ${tone.ring} ${first ? "neon-glow sm:order-2 sm:pb-12 sm:pt-8" : placement.position === 2 ? "sm:order-1 sm:pb-6" : "sm:order-3"}`}
          >
            <span className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${tone.text}`}>
              {first ? <Crown className="size-5" aria-hidden="true" /> : <Medal className="size-5" aria-hidden="true" />}{labels[placement.position]}
            </span>
            <p className={`mt-3 font-extrabold text-white ${first ? "text-2xl" : "text-xl"}`}>{placement.displayName}</p>
          </li>
        );
      })}
    </ol>
  );
}
