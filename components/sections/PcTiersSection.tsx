import { CircuitBoard, Cpu, HardDrive, MemoryStick, Monitor, Mouse, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PcTier } from "@/types";

export function PcTiersSection({ tiers }: { tiers: PcTier[] }) {
  const specs = [
    { key: "cpu", icon: Cpu, label: "CPU" }, { key: "gpu", icon: Video, label: "GPU" },
    { key: "ram", icon: MemoryStick, label: "RAM" }, { key: "monitor", icon: Monitor, label: "Màn hình" },
    { key: "mainboard", icon: CircuitBoard, label: "Mainboard" }, { key: "storage", icon: HardDrive, label: "Ổ cứng" },
    { key: "peripherals", icon: Mouse, label: "Thiết bị" },
  ] as const;
  return (
    <section id="cau-hinh" className="section-space bg-black">
      <Container>
        <SectionHeading eyebrow="Sức mạnh phần cứng" title="Cấu hình cho mọi trận chiến" description="Từ những trận rank giải trí tới đấu trường cạnh tranh, luôn có hạng máy phù hợp với bạn." centered />
        <div className="mt-8 space-y-3 md:hidden">
          {tiers.map((tier) => (
            <details key={tier.id} className="group rounded-xl border border-white/10 bg-white/[0.03] open:border-tiger-orange/40">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-extrabold uppercase text-white"><span>{tier.name}</span><span className="text-sm text-tiger-orange group-open:rotate-45">+</span></summary>
              <div className="border-t border-white/10 px-5 py-4">
                <p className="text-sm leading-6 text-zinc-400">{tier.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3">{specs.filter(({ key }) => tier[key]).map(({ key, label }) => <div key={key}><dt className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</dt><dd className="mt-1 text-xs font-semibold text-zinc-200">{tier[key]}</dd></div>)}</dl>
                {tier.note || tier.branchScope ? <p className="mt-4 text-xs leading-5 text-zinc-600">{[tier.note, tier.branchScope].filter(Boolean).join(" · ")}</p> : null}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-12 hidden gap-5 md:grid md:grid-cols-2">
          {tiers.map((tier, index) => (
            <article key={tier.id} className={`rounded-2xl border p-6 sm:p-8 ${tier.featured ? "border-tiger-orange/50 bg-gradient-to-br from-tiger-red/15 to-white/[0.03] shadow-glow" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-widest text-tiger-orange">Cấu hình</p><h3 className="mt-2 text-3xl font-extrabold uppercase text-white">{tier.name}</h3></div>
                <span className="font-display text-4xl font-black text-white/10">0{index + 1}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                {specs.filter(({ key }) => tier[key]).map(({ key, icon: Icon, label }) => <div key={key} className="flex items-start gap-3 rounded-xl bg-black/40 p-3.5"><Icon className="mt-0.5 size-4 shrink-0 text-tiger-orange" /><div><dt className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</dt><dd className="mt-1 text-sm font-semibold text-zinc-200">{tier[key]}</dd></div></div>)}
              </dl>
              {tier.note || tier.branchScope ? <p className="mt-5 text-xs leading-5 text-zinc-600">{[tier.note, tier.branchScope].filter(Boolean).join(" · ")}</p> : null}
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-600">Cấu hình thực tế có thể khác nhau theo từng cơ sở.</p>
      </Container>
    </section>
  );
}
