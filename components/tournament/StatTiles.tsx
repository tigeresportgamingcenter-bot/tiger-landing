import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

export interface StatTile {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}

/** Quick facts under the title: one square tile each, arriving one after another. */
export function StatTiles({ tiles }: { tiles: StatTile[] }) {
  if (!tiles.length) return null;
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ icon: Icon, label, value }, index) => (
        <li key={label} style={{ "--i": index + 3 } as CSSProperties} className="enter card-lift rounded-xl bg-black/45 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          <span className="grid size-10 place-items-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/40" aria-hidden="true"><Icon className="size-5" /></span>
          <p className="mt-3 text-sm font-semibold text-zinc-400">{label}</p>
          <p className="mt-0.5 text-lg font-extrabold leading-snug text-white tabular-nums">{value}</p>
        </li>
      ))}
    </ul>
  );
}
