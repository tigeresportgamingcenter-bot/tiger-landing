import Image from "next/image";
import { gameLabel } from "@/lib/games";
import type { TournamentStatus } from "@/types";
import type { LauncherData } from "./launcherTypes";
import { Empty, Pager, SlideTitle, eventWhen, money, prizeText, rise, statusLabels, useCycle } from "./slideKit";

const statusStyle: Record<TournamentStatus, string> = {
  registration_open: "bg-accent text-ground",
  ongoing: "bg-white text-ground",
  upcoming: "bg-white/15 text-white",
  completed: "bg-white/15 text-white",
};

export function TournamentsSlide({ data }: { data: LauncherData }) {
  const index = useCycle(data.events.length);
  const event = data.events[index];
  if (!event) return <Empty text="Chưa có giải mới. Theo dõi fanpage để không bỏ lỡ!" />;
  const qr = data.registrationQr[event.id];
  const fee = event.entryFee === null ? null : event.entryFee === 0 ? "Miễn phí" : `Phí ${money(event.entryFee)}`;
  const visual = event.image ?? event.video?.poster ?? null;
  const facts = [event.branchName, event.format, fee].filter((item): item is string => Boolean(item)).join(" · ");

  return (
    <div className="flex h-full flex-col gap-6">
      <SlideTitle>Giải đấu</SlideTitle>
      <div key={event.id} className="grid min-h-0 flex-1 gap-10 [grid-template-columns:1.5fr_1fr]">
        <div className="rise relative min-h-0" style={rise(1)}>
          {visual ? <Image src={visual.src} alt={visual.alt} fill sizes="60vw" className="object-contain" priority /> : (
            <div className="flex h-full flex-col justify-end bg-accent p-12">
              <p className="font-display text-[11rem] uppercase text-ground">{gameLabel(event.game)}</p>
            </div>
          )}
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <p className={`rise w-fit px-5 py-2 text-[1.625rem] font-extrabold ${statusStyle[event.status]}`} style={rise(2)}>{statusLabels[event.status]}</p>
          <h3 className="rise font-display text-[4.25rem] uppercase text-white" style={rise(2)}>{event.name}</h3>
          <p className="rise text-[2rem] font-bold text-accent" style={rise(3)}>{gameLabel(event.game)}</p>
          <p className="rise text-[2rem] font-bold text-white" style={rise(3)}>{eventWhen(event)}</p>
          {facts ? <p className="rise text-[1.625rem] text-zinc-200" style={rise(4)}>{facts}</p> : null}
          <div className="rise mt-auto flex items-end justify-between gap-6" style={rise(5)}>
            {event.prizePool ? <div><p className="text-[1.375rem] font-semibold text-zinc-300">Giải thưởng</p><p className="font-display text-[3.5rem] text-white">{prizeText(event.prizePool)}</p></div> : <span />}
            {qr ? (
              <figure className="shrink-0 text-center">
                <Image src={qr} alt={`Mã QR đăng ký ${event.name}`} width={200} height={200} unoptimized className="size-[10rem]" />
                <figcaption className="mt-1 text-[1.375rem] font-extrabold text-white">Quét để đăng ký</figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </div>
      <Pager labels={data.events.map((item) => item.name)} active={index} />
    </div>
  );
}
