import { CalendarDays, CheckCircle2, Flame, MapPin } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Promotion } from "@/types";

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const promotionTypeLabels: Record<Promotion["promotionType"], string> = {
  combo: "Combo giờ chơi",
  topup_bonus: "Ưu đãi nạp tiền",
  gift: "Tặng quà",
  event: "Sự kiện",
  discount: "Giảm giá",
  other: "Khác",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

function validityLabel(promotion: Promotion) {
  if (promotion.validFrom && promotion.validUntil) return `Áp dụng từ ${formatDate(promotion.validFrom)} đến ${formatDate(promotion.validUntil)}`;
  if (promotion.validFrom) return `Áp dụng từ ${formatDate(promotion.validFrom)}`;
  if (promotion.validUntil) return `Áp dụng đến ${formatDate(promotion.validUntil)}`;
  return "Đang áp dụng";
}

function PromotionCard({ promotion, actionHref, compact = false }: { promotion: Promotion; actionHref: string; compact?: boolean }) {
  const isTopupBonus = promotion.promotionType === "topup_bonus";

  return (
    <article className="flex min-w-[86vw] snap-center flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#260806] via-[#120605] to-zinc-950 sm:min-w-0">
      {promotion.image ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
          <Image src={promotion.image.src} alt={promotion.image.alt} fill sizes="(max-width: 639px) 86vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="promo-shine flex w-fit items-center gap-2 overflow-hidden rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300">
            <Flame className="size-4" /> Đang áp dụng
          </span>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">{promotionTypeLabels[promotion.promotionType]}</span>
          {promotion.featured ? <span className="rounded-full border border-tiger-orange/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">Nổi bật</span> : null}
        </div>

        <h3 className="mt-4 text-2xl font-extrabold uppercase text-white">{promotion.name}</h3>

        {!isTopupBonus && promotion.price !== null ? <p className="mt-3 text-3xl font-extrabold text-gradient">{formatPrice(promotion.price)}đ</p> : null}

        {isTopupBonus && promotion.tiers.length > 0 ? (
          <div className="mt-5 space-y-2 rounded-2xl border border-tiger-orange/20 bg-black/25 p-4">
            {promotion.tiers.map((tier) => (
              <div key={`${tier.payAmount}-${tier.receiveAmount}-${tier.sortOrder}`} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-sm font-bold text-white">Nạp {formatPrice(tier.payAmount)}đ</span>
                <span className="text-sm font-extrabold text-orange-300">Nhận {formatPrice(tier.receiveAmount)}đ</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 space-y-2 text-xs text-zinc-500">
          <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-tiger-orange" />{validityLabel(promotion)}</p>
          {promotion.branchScope ? <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-tiger-orange" />{promotion.branchScope}</p> : null}
        </div>

        {promotion.highlights.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {promotion.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm font-semibold text-zinc-200">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-tiger-orange" />{highlight}
              </li>
            ))}
          </ul>
        ) : null}

        {promotion.note ? <p className="mt-5 text-sm leading-6 text-zinc-500">{promotion.note}</p> : null}
        {!compact ? <ButtonLink href={actionHref} className="mt-auto w-full pt-6">{isTopupBonus ? "Hỏi tại quầy" : "Gọi hỏi combo"}</ButtonLink> : null}
      </div>
    </article>
  );
}

export function PromotionsSection({ promotions, upcomingPromotions = [], actionHref }: { promotions: Promotion[]; upcomingPromotions?: Promotion[]; actionHref: string }) {
  if (!promotions.length && !upcomingPromotions.length) return null;
  const orderedPromotions = [...promotions].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-24" id="khuyen-mai">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,74,0,0.16),transparent_32%)]" />
      <Container className="relative">
        <SectionHeading eyebrow="Ưu đãi Tiger" title="Khuyến mãi đang diễn ra" description="Các chương trình đang áp dụng tại Tiger Esports. Vui lòng liên hệ trước khi đến để xác nhận theo từng cơ sở." />
        {orderedPromotions.length ? (
          <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {orderedPromotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} actionHref={actionHref} />)}
          </div>
        ) : null}
        {orderedPromotions.length > 1 ? <p className="mt-3 text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</p> : null}
        {upcomingPromotions.length ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h3 className="text-lg font-extrabold text-white">Sắp diễn ra</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {upcomingPromotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} actionHref={actionHref} compact />)}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
