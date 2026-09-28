import { CircuitBoard, Cpu, HardDrive, MemoryStick, Monitor, Mouse, Video } from "lucide-react";
import { BranchTabs } from "@/components/ui/BranchTabs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PcTier, PricingPlan } from "@/types";

const specs = [
  { key: "cpu", icon: Cpu, label: "CPU" }, { key: "gpu", icon: Video, label: "GPU" },
  { key: "ram", icon: MemoryStick, label: "RAM" }, { key: "monitor", icon: Monitor, label: "Màn hình" },
  { key: "mainboard", icon: CircuitBoard, label: "Mainboard" }, { key: "storage", icon: HardDrive, label: "Ổ cứng" },
  { key: "peripherals", icon: Mouse, label: "Thiết bị" },
] as const;

const formatPrice = (value: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value / 1000)}K`;

interface TierWithPrice extends PcTier {
  price: PricingPlan | null;
}

function mergeTiersWithPricing(tiers: PcTier[], pricing: PricingPlan[]): TierWithPrice[] {
  return tiers.map((tier) => ({
    ...tier,
    price: pricing.find((plan) => plan.tierId === tier.id) ?? pricing.find((plan) => plan.branchScope === tier.branchScope && plan.tier === tier.name) ?? null,
  }));
}

function groupByBranch(tiers: TierWithPrice[]) {
  const scopes = Array.from(new Set(tiers.map((tier) => tier.branchScope)));
  if (scopes.length <= 1) return [{ label: null as string | null, items: tiers }];
  return scopes.map((scope) => ({ label: scope, items: tiers.filter((tier) => tier.branchScope === scope) }));
}

function PriceTag({ price }: { price: PricingPlan | null }) {
  if (!price) return null;
  return (
    <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-2xl font-extrabold text-white">{formatPrice(price.pricePerHour)}<span className="text-sm font-semibold text-zinc-500"> / giờ</span></span>
      {price.nightComboPrice ? <span className="text-xs font-bold text-tiger-orange">Combo đêm {formatPrice(price.nightComboPrice)}</span> : null}
    </div>
  );
}

function TierGrid({ tiers }: { tiers: TierWithPrice[] }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {tiers.map((tier) => (
          <details key={tier.id} className="group rounded-xl border border-white/10 bg-white/[0.03] open:border-tiger-orange/40">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-white">
              <span className="font-extrabold uppercase">{tier.name}</span>
              <span className="flex items-center gap-3">
                {tier.price ? <span className="text-sm font-extrabold text-white">{formatPrice(tier.price.pricePerHour)}<span className="text-xs font-semibold text-zinc-500">/giờ</span></span> : null}
                <span className="text-sm text-tiger-orange group-open:rotate-45">+</span>
              </span>
            </summary>
            <div className="border-t border-white/10 px-5 py-4">
              {tier.price?.nightComboPrice ? <p className="mb-3 text-xs font-bold text-tiger-orange">Combo đêm: {formatPrice(tier.price.nightComboPrice)}</p> : null}
              <p className="text-sm leading-6 text-zinc-400">{tier.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">{specs.filter(({ key }) => tier[key]).map(({ key, label }) => <div key={key}><dt className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</dt><dd className="mt-1 text-xs font-semibold text-zinc-200">{tier[key]}</dd></div>)}</dl>
              {tier.note ? <p className="mt-4 text-xs leading-5 text-zinc-600">{tier.note}</p> : null}
            </div>
          </details>
        ))}
      </div>
      <div className="mt-6 hidden gap-5 md:grid md:grid-cols-2">
        {tiers.map((tier, index) => (
          <article key={tier.id} className={`card-glow-hover rounded-2xl border p-6 sm:p-8 ${tier.featured ? "border-tiger-orange/50 bg-gradient-to-br from-tiger-red/15 to-white/[0.03] shadow-glow" : "border-white/10 bg-white/[0.03]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-tiger-orange">Cấu hình</p>
                <h3 className="mt-2 text-3xl font-extrabold uppercase text-white">{tier.name}</h3>
                <PriceTag price={tier.price} />
              </div>
              <span className="font-display text-4xl font-black text-white/10">0{index + 1}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              {specs.filter(({ key }) => tier[key]).map(({ key, icon: Icon, label }) => <div key={key} className="flex items-start gap-3 rounded-xl bg-black/40 p-3.5"><Icon className="mt-0.5 size-4 shrink-0 text-tiger-orange" /><div><dt className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</dt><dd className="mt-1 text-sm font-semibold text-zinc-200">{tier[key]}</dd></div></div>)}
            </dl>
            {tier.note ? <p className="mt-5 text-xs leading-5 text-zinc-600">{tier.note}</p> : null}
          </article>
        ))}
      </div>
    </>
  );
}

export function PcTiersSection({ tiers, pricing, actionHref }: { tiers: PcTier[]; pricing: PricingPlan[]; actionHref: string }) {
  const merged = mergeTiersWithPricing(tiers, pricing);
  const groups = groupByBranch(merged);
  const tabGroups = groups.map((group) => ({ label: group.label ?? "Tất cả", content: <TierGrid tiers={group.items} /> }));
  return (
    <section id="bang-gia" className="section-space section-glow section-glow-alt bg-black">
      <Container>
        <SectionHeading eyebrow="Bảng giá & cấu hình" title="Chọn hạng máy, vào trận ngay" description="Mỗi hạng máy đi kèm giá/giờ, combo đêm và cấu hình thực tế theo từng cơ sở." centered />
        <div className="mt-8">
          <BranchTabs groups={tabGroups} />
        </div>
        <div className="mt-8 flex flex-col items-center gap-5 text-center">
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">Giá, combo và cấu hình có thể thay đổi theo từng cơ sở. Vui lòng liên hệ hotline để xác nhận trước khi đến.</p>
          <ButtonLink href={actionHref} variant="secondary">Gọi kiểm tra giá</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
