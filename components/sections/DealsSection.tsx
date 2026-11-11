import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { formatHourlyPrice } from "@/lib/formatPrice";
import type { PcTier, PricingPlan, Promotion } from "@/types";

const specs = [
  { key: "cpu", label: "CPU" }, { key: "gpu", label: "GPU" }, { key: "ram", label: "RAM" },
  { key: "monitor", label: "Màn hình" }, { key: "mainboard", label: "Mainboard" },
  { key: "storage", label: "Ổ cứng" }, { key: "peripherals", label: "Thiết bị" },
] as const;

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
const formatThousands = (value: number) => `${formatNumber(value / 1000)}K`;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

function validityLabel(promotion: Promotion) {
  if (promotion.validFrom && promotion.validUntil) return `Áp dụng từ ${formatDate(promotion.validFrom)} đến ${formatDate(promotion.validUntil)}`;
  if (promotion.validFrom) return `Áp dụng từ ${formatDate(promotion.validFrom)} đến khi có thông báo mới`;
  if (promotion.validUntil) return `Áp dụng đến ${formatDate(promotion.validUntil)}`;
  return promotion.promotionType === "combo" ? "Áp dụng đến khi có thông báo mới" : "Đang áp dụng";
}

interface TierRow {
  id: string;
  name: string;
  plan: PricingPlan | undefined;
  tier: PcTier | undefined;
}

const normalize = (value: string) => value.trim().toLowerCase();

function findPlan(tier: PcTier, pricing: PricingPlan[]) {
  return pricing.find((plan) => plan.tierId === tier.id) ?? pricing.find((plan) => normalize(plan.tier) === normalize(tier.name));
}

function buildRows(tiers: PcTier[], pricing: PricingPlan[]): TierRow[] {
  const rows = tiers.map((tier) => ({ id: tier.id, name: tier.name, tier, plan: findPlan(tier, pricing) }));
  const unmatched = pricing.filter((plan) => !rows.some((row) => row.plan === plan));
  return [...rows, ...unmatched.map((plan) => ({ id: plan.tierId, name: plan.tier, tier: undefined, plan }))];
}

function PromoCard({ promotion, actionHref, upcoming }: { promotion: Promotion; actionHref: string; upcoming: boolean }) {
  const isTopupBonus = promotion.promotionType === "topup_bonus";
  const tiers = [...promotion.tiers].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 4);

  return (
    <article className="motion-card rounded-lg bg-ground p-6 text-paper">
      <h3 className="font-display text-4xl uppercase">{promotion.name}</h3>
      {upcoming ? <p className="mt-1 text-base font-semibold text-accent">Sắp diễn ra</p> : null}
      {!isTopupBonus && promotion.price !== null ? <p className="mt-2 text-3xl font-extrabold tabular-nums text-accent">{formatNumber(promotion.price)}đ</p> : null}
      {isTopupBonus && tiers.length > 0 ? (
        <dl className="mt-4 grid gap-1">
          {tiers.map((tier) => (
            <div key={`${tier.payAmount}-${tier.receiveAmount}-${tier.sortOrder}`} className="flex justify-between gap-4 text-lg tabular-nums">
              <dt>Nạp {formatThousands(tier.payAmount)}</dt>
              <dd className="font-bold">Nhận {formatThousands(tier.receiveAmount)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {promotion.highlights.length > 0 ? <ul className="mt-4 grid gap-1 text-base text-zinc-300">{promotion.highlights.slice(0, 3).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}
      <p className="mt-4 text-base text-zinc-400">{[validityLabel(promotion), promotion.branchScope].filter(Boolean).join(" · ")}</p>
      <ButtonLink href={actionHref} className="mt-5 w-full">{isTopupBonus ? "Hỏi tại quầy" : "Gọi hỏi combo"}</ButtonLink>
    </article>
  );
}

interface DealsSectionProps {
  tiers: PcTier[];
  pricing: PricingPlan[];
  promotions: Promotion[];
  upcomingPromotions: Promotion[];
  actionHref: string;
}

export function DealsSection({ tiers, pricing, promotions, upcomingPromotions, actionHref }: DealsSectionProps) {
  const rows = buildRows(tiers, pricing);
  const orderedPromotions = [...promotions].sort((a, b) => Number(b.featured) - Number(a.featured));
  const hasPromotions = orderedPromotions.length > 0 || upcomingPromotions.length > 0;
  if (!rows.length && !hasPromotions) return null;

  return (
    <section id="bang-gia" className="bg-paper py-20 text-ground sm:py-28">
      <span id="cau-hinh" className="block" />
      <span id="khuyen-mai" className="block" />
      <Container>
        <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-5xl uppercase sm:text-6xl lg:text-7xl">Giá và ưu đãi</h2>
            <p className="mt-4 max-w-[48ch] text-balance text-lg leading-snug text-zinc-700">Chọn hạng máy hợp với cách bạn chơi, kèm các combo đang chạy. Giá và cấu hình có thể khác theo cơ sở, gọi để xác nhận trước khi đến.</p>
          </div>
          <ButtonLink href={actionHref} className="self-start lg:self-auto">Gọi kiểm tra giá</ButtonLink>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className={`reveal grid content-start gap-2 ${hasPromotions ? "lg:col-span-7" : "lg:col-span-12 lg:max-w-3xl"}`}>
            {rows.map((row, index) => (
              <details key={row.id} name="tier" open={index === 0} className="group rounded-lg bg-white transition-colors open:neon-box open:bg-ground open:text-paper">
                <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-5 sm:px-7">
                  <span className="font-display text-4xl uppercase sm:text-5xl">{row.name}</span>
                  <span className="flex items-center gap-3">
                    {row.plan ? <span className="text-xl font-bold tabular-nums">{formatHourlyPrice(row.plan.pricePerHour)}<span className="text-base font-medium opacity-80">/giờ</span></span> : null}
                    <ChevronDown className="size-5 transition group-open:rotate-180" aria-hidden="true" />
                  </span>
                </summary>
                <div className="px-5 pb-6 sm:px-7">
                  {row.tier ? <p className="max-w-[52ch] text-lg leading-snug text-zinc-700 group-open:text-zinc-300">{row.tier.description}</p> : null}
                  {row.plan ? <p className="mt-3 max-w-[52ch] text-base text-zinc-700 group-open:text-zinc-300">{row.plan.note}</p> : null}
                  {row.tier ? (
                    <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      {specs.filter(({ key }) => row.tier?.[key]).map(({ key, label }) => (
                        <div key={key}><dt className="text-base text-zinc-600 group-open:text-zinc-400">{label}</dt><dd className="mt-0.5 text-lg font-semibold">{row.tier?.[key]}</dd></div>
                      ))}
                    </dl>
                  ) : null}
                  {row.tier && (row.tier.note || row.tier.branchScope) ? <p className="mt-5 text-base text-zinc-600 group-open:text-zinc-400">{[row.tier.note, row.tier.branchScope].filter(Boolean).join(" · ")}</p> : null}
                </div>
              </details>
            ))}
          </div>
          {hasPromotions ? (
            <div className={`reveal grid content-start gap-3 ${rows.length ? "lg:col-span-5" : "lg:col-span-12 lg:grid-cols-2"}`}>
              {orderedPromotions.map((promotion) => <PromoCard key={promotion.id} promotion={promotion} actionHref={actionHref} upcoming={false} />)}
              {upcomingPromotions.map((promotion) => <PromoCard key={promotion.id} promotion={promotion} actionHref={actionHref} upcoming />)}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
