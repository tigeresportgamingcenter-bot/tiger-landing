import { CheckCircle2, Flame } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Promotion } from "@/types";

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

function PromotionCard({ promotion, actionHref }: { promotion: Promotion; actionHref: string }) {
  return (
    <article className="flex min-w-[86vw] snap-center flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#260806] via-[#120605] to-zinc-950 sm:min-w-0">
      {promotion.image ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
          <Image src={promotion.image.src} alt={promotion.image.alt} fill sizes="(max-width: 639px) 86vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <p className="promo-shine flex w-fit items-center gap-2 overflow-hidden rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300">
          <Flame className="size-4" /> {promotion.featured ? "Combo nổi bật" : "Combo Tiger"}
        </p>
        <h3 className="mt-3 text-2xl font-extrabold uppercase text-white">{promotion.name}</h3>
        <p className="mt-3 text-3xl font-extrabold text-gradient">{formatPrice(promotion.price)}đ</p>
        {promotion.note ? <p className="mt-3 text-sm leading-6 text-zinc-500">{promotion.note}</p> : null}
        {promotion.highlights.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {promotion.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm font-semibold text-zinc-200">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-tiger-orange" />{highlight}
              </li>
            ))}
          </ul>
        ) : null}
        <ButtonLink href={actionHref} className="mt-auto w-full pt-6">Gọi hỏi combo</ButtonLink>
      </div>
    </article>
  );
}

export function PromotionsSection({ promotions, actionHref }: { promotions: Promotion[]; actionHref: string }) {
  if (!promotions.length) return null;
  const orderedPromotions = [...promotions].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,74,0,0.16),transparent_32%)]" />
      <Container className="relative">
        <SectionHeading eyebrow="Ưu đãi Tiger" title="Combo nổi bật" description="Chọn combo phù hợp và liên hệ Tiger để xác nhận trước khi đến." />
        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {orderedPromotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} actionHref={actionHref} />)}
        </div>
        {orderedPromotions.length > 1 ? <p className="mt-3 text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</p> : null}
      </Container>
    </section>
  );
}
