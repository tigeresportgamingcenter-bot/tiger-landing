import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqItem } from "@/types";

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="section-space bg-black">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Thông tin cần biết" description="Giải đáp nhanh về giờ chơi, combo, khuyến mãi và giải đấu tại Tiger Esports." />
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <details key={item.id} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-tiger-orange/40">
              <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-bold text-white">
                {item.question}<span className="text-xl text-tiger-orange transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-zinc-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
