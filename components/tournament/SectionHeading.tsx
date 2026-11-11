import type { LucideIcon } from "lucide-react";

/** Section title with an icon tile and a fading rule underneath. */
export function SectionHeading({ icon: Icon, children, id }: { icon: LucideIcon; children: string; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/40" aria-hidden="true"><Icon className="size-5" /></span>
        <h2 className="text-2xl font-extrabold text-white">{children}</h2>
      </div>
      <span className="mt-4 block h-px bg-gradient-to-r from-accent/70 via-accent/20 to-transparent" aria-hidden="true" />
    </div>
  );
}
