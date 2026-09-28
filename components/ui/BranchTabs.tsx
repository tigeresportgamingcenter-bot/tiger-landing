"use client";

import { useState, type ReactNode } from "react";

interface BranchTabsProps {
  groups: Array<{ label: string; content: ReactNode }>;
}

export function BranchTabs({ groups }: BranchTabsProps) {
  const [active, setActive] = useState(0);

  if (groups.length <= 1) return <>{groups[0]?.content}</>;

  return (
    <div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {groups.map((group, index) => (
          <button
            key={group.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold uppercase tracking-wide ${index === active ? "border-tiger-orange bg-tiger-orange text-white" : "border-white/15 text-zinc-400 hover:text-white"}`}
          >
            {group.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{groups[active]?.content}</div>
    </div>
  );
}
