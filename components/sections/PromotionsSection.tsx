import { CheckCircle2, Flame } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { Promotion } from "@/types";

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

export function PromotionsSection({ promotion, actionHref }: { promotion: Promotion | null; actionHref: string }) {
  if (!promotion) return null;
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,74,0,0.2),transparent_30%)]" />
      <Container className="relative">
        <div className="overflow-hidden rounded-3xl border border-tiger-orange/40 bg-gradient-to-br from-[#260806] via-[#120605] to-zinc-950 p-7 shadow-glow sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-300"><Flame className="size-4" /> Combo nổi bật</p>
              <h2 className="mt-4 font-display text-4xl font-black uppercase leading-tight text-white sm:text-6xl">{promotion.name}</h2>
              <p className="mt-5 font-display text-4xl font-black text-gradient sm:text-5xl">{formatPrice(promotion.price)}đ</p>
              <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">{promotion.note}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-6 sm:p-8">
              <ul className="space-y-5">
                {promotion.highlights.map((highlight) => <li key={highlight} className="flex items-center gap-3 font-semibold text-zinc-200"><CheckCircle2 className="size-5 shrink-0 text-tiger-orange" />{highlight}</li>)}
              </ul>
              <ButtonLink href={actionHref} className="mt-8 w-full">Gọi hỏi combo</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
