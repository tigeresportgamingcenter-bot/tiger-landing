import type { CSSProperties } from "react";
import { Camera, Check, IdCard, KeyRound } from "lucide-react";
import { FadeImage } from "@/components/ui/FadeImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CountUp } from "@/components/ui/CountUp";
import { Container } from "@/components/ui/Container";
import { gearRentalTerms } from "@/data/gearTerms";
import { gearCategories, gearCategoryLabel, gearPriceUnitLabel } from "@/lib/gear";
import type { GearItem } from "@/types";

const termIcons = { id: IdCard, key: KeyRound, photo: Camera } as const;

function GearCard({ item, index }: { item: GearItem; index: number }) {
  return (
    <article style={{ "--i": index } as CSSProperties} className={`card-lift card-tilt stagger-item group flex flex-col overflow-hidden rounded-lg bg-ground ${item.available ? "" : "opacity-70"}`}>
      {item.image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-white ring-1 ring-inset ring-white/10">
          <FadeImage src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-active:scale-110" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-base font-bold uppercase tracking-wide text-zinc-400">{gearCategoryLabel(item.category)}</p>
        <h3 className="mt-1 font-display text-3xl uppercase leading-tight text-white">{item.name}</h3>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {item.price !== null
            ? <p className="text-3xl font-extrabold tabular-nums text-accent"><CountUp value={item.price} />đ<span className="text-base font-semibold text-zinc-300">/{gearPriceUnitLabel(item.priceUnit)}</span></p>
            : <p className="text-lg font-bold text-accent">Hỏi giá tại quầy</p>}
          {item.available
            ? <span className="inline-flex items-center gap-2 text-base font-semibold text-emerald-300"><span className="relative flex size-2" aria-hidden="true"><span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" /><span className="relative size-2 rounded-full bg-emerald-400" /></span>Còn hàng</span>
            : <span className="rounded-full bg-white/10 px-3 py-1 text-base font-semibold text-zinc-200">Tạm hết</span>}
        </div>
        {item.description ? <p className="mt-4 text-base leading-snug text-zinc-100">{item.description}</p> : null}
        {item.specs.length ? (
          <ul className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            {item.specs.map((spec, specIndex) => (
              <li key={spec} style={{ "--i": specIndex } as CSSProperties} className="stagger-item flex items-start gap-2 text-base leading-snug text-zinc-300">
                <Check className="mt-0.5 size-4 shrink-0 text-accent transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />{spec}
              </li>
            ))}
          </ul>
        ) : null}
        {item.note || item.branchScope ? <p className="mt-4 text-base text-zinc-400">{[item.note, item.branchScope].filter(Boolean).join(" · ")}</p> : null}
      </div>
    </article>
  );
}

interface GearSectionProps {
  items: GearItem[];
  actionHref: string;
}

export function GearSection({ items, actionHref }: GearSectionProps) {
  // Same category together (mouse, keyboard, controller...), and the shop's own order inside each category.
  const categoryOrder = gearCategories.map((category) => category.value as string);
  const ordered = [...items].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

  return (
    <section id="cho-thue-gear" className="ambient bg-panel py-20 sm:py-28">
      <Container>
        <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">Cho thuê gear</h2>
            <p className="mt-4 max-w-[52ch] text-balance text-lg leading-snug text-zinc-300">
              {ordered.length
                ? "Gear cao cấp thuê theo lượt ngay tại quầy, không cần mang theo đồ. Số lượng có hạn và có thể khác nhau theo cơ sở, hãy gọi để giữ đồ trước khi đến."
                : "Thuê gear ngay tại quầy, không cần mang theo đồ. Gọi hoặc nhắn Zalo để biết thiết bị đang có và giá thuê tại từng cơ sở."}
            </p>
          </div>
          <ButtonLink href={actionHref} className="self-start lg:self-auto">Hỏi thuê gear</ButtonLink>
        </div>

        {ordered.length ? (
          <div className="reveal mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((item, index) => <GearCard key={item.id} item={item} index={index} />)}
          </div>
        ) : null}

        <div className="reveal-scale mt-12 rounded-lg bg-ground p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <h3 className="font-display text-4xl uppercase text-white">Điều kiện thuê</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:max-w-3xl lg:flex-1">
            {gearRentalTerms.map((term) => {
              const Icon = termIcons[term.key];
              return (
                <li key={term.key} className="flex min-h-14 items-center gap-3 rounded-lg bg-white/5 px-4 text-lg font-semibold text-white">
                  <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{term.label}<span className="block text-base font-medium text-zinc-400">{term.tag}</span></span>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
