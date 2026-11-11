import Image from "next/image";
import type { LauncherData } from "./launcherTypes";
import { Empty, Pager, SlideTitle, money, pickPromotions, rise, shortDate, useCycle } from "./slideKit";

export function PromotionsSlide({ data }: { data: LauncherData }) {
  const list = pickPromotions(data);
  const index = useCycle(list.length);
  const promotion = list[index];
  if (!promotion) return <Empty text="Chương trình ưu đãi đang được cập nhật" />;
  const until = shortDate(promotion.validUntil);

  return (
    <div className="flex h-full flex-col gap-6">
      <SlideTitle aside="Hỏi nhân viên tại quầy để áp dụng">Ưu đãi đang có</SlideTitle>
      <div key={promotion.id} className="grid min-h-0 flex-1 gap-10 [grid-template-columns:1.65fr_1fr]">
        <div className="rise relative min-h-0 self-start" style={rise(1)}>
          {promotion.image ? (
            <div className="relative aspect-video w-full overflow-hidden bg-panel">
              <Image src={promotion.image.src} alt={promotion.image.alt} fill sizes="60vw" className="object-contain" priority />
            </div>
          ) : (
            <div className="grid aspect-video w-full place-items-center bg-accent p-10"><p className="font-display text-[8rem] uppercase text-ground">{promotion.name}</p></div>
          )}
        </div>
        <div className="flex min-h-0 flex-col gap-5">
          <h3 className="rise font-display text-[4.75rem] uppercase text-white" style={rise(2)}>{promotion.name}</h3>
          {promotion.price !== null ? <p className="rise font-display text-[8rem] text-accent tabular-nums" style={rise(3)}>{money(promotion.price)}</p> : null}
          {promotion.tiers.length ? (
            <ul className="rise grid gap-2" style={rise(3)}>
              {promotion.tiers.slice(0, 4).map((tier) => (
                <li key={tier.sortOrder} className="flex items-baseline justify-between bg-panel px-6 py-3 text-[2rem] font-bold text-white tabular-nums">
                  <span>Nạp {money(tier.payAmount)}</span><span className="text-accent">Nhận {money(tier.receiveAmount)}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="rise grid gap-1 text-[1.75rem] text-zinc-100" style={rise(4)}>
            {promotion.highlights.slice(0, 4).map((line) => <li key={line}>{line}</li>)}
          </ul>
          {until ? <p className="rise mt-auto text-[1.5rem] font-bold text-zinc-300" style={rise(5)}>Áp dụng đến {until}</p> : null}
        </div>
      </div>
      <Pager labels={list.map((item) => item.name)} active={index} />
    </div>
  );
}
