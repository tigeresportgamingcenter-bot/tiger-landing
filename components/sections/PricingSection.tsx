import { Check, Crown } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PricingPlan } from "@/types";

const formatPrice = (value: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value / 1000)}K`;

export function PricingSection({ pricing, actionHref }: { pricing: PricingPlan[]; actionHref: string }) {
  return (
    <section id="bang-gia" className="section-space bg-zinc-950">
      <Container>
        <SectionHeading eyebrow="Bảng giá tham chiếu" title="Chọn hạng máy, vào trận ngay" description="Mức giá linh hoạt cho từng nhu cầu chơi game và thi đấu." centered />
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {pricing.map((plan) => (
            <article key={plan.tierId} className={`relative min-w-[78vw] snap-center rounded-2xl border p-6 sm:min-w-0 ${plan.featured ? "border-tiger-orange bg-gradient-to-b from-tiger-red/20 to-white/[0.03]" : "border-white/10 bg-white/[0.03]"}`}>
              {plan.featured ? <span className="absolute right-4 top-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-300"><Crown className="size-3.5" /> Đỉnh cao</span> : null}
              <h3 className="text-xl font-extrabold uppercase text-white">{plan.tier}</h3>
              <div className="mt-6 flex items-end gap-1"><span className="text-3xl font-extrabold text-white">{formatPrice(plan.pricePerHour)}</span><span className="pb-1 text-sm text-zinc-500">/ giờ</span></div>
              <p className="mt-5 flex gap-2 text-sm leading-6 text-zinc-400"><Check className="mt-1 size-4 shrink-0 text-tiger-orange" />{plan.note}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-5 text-center">
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">Giá và combo có thể thay đổi theo từng cơ sở. Vui lòng liên hệ hotline để xác nhận trước khi đến.</p>
          <ButtonLink href={actionHref} variant="secondary">Gọi kiểm tra giá</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
