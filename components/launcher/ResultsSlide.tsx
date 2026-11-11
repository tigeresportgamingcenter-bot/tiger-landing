import { gameLabel } from "@/lib/games";
import type { ChampionPlacement } from "@/types";
import type { LauncherData } from "./launcherTypes";
import { Empty, Pager, SlideTitle, prizeText, rise, shortDate, useCycle } from "./slideKit";

const podium = [
  { position: 2 as const, height: "h-[68%]", style: "bg-panel text-white", step: 2 },
  { position: 1 as const, height: "h-full", style: "bg-accent text-ground", step: 1 },
  { position: 3 as const, height: "h-[52%]", style: "bg-panel text-white", step: 3 },
];

function Podium({ placements }: { placements: ChampionPlacement[] }) {
  return (
    <div className="grid h-full items-end gap-4 [grid-template-columns:1fr_1.15fr_1fr]">
      {podium.map(({ position, height, style, step }) => {
        const place = placements.find((item) => item.position === position);
        return (
          <div key={position} className={`rise flex flex-col justify-between p-7 ${height} ${style}`} style={rise(step)}>
            <span className="font-display text-[9rem] leading-none">{position}</span>
            <span className="text-[2.5rem] font-extrabold leading-tight">{place?.displayName ?? "—"}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ResultsSlide({ data }: { data: LauncherData }) {
  const index = useCycle(data.completedEvents.length);
  const event = data.completedEvents[index];
  if (!event) return <Empty text="Kết quả giải đấu sẽ được cập nhật tại đây" />;

  return (
    <div className="flex h-full flex-col gap-6">
      <SlideTitle>Tổng kết giải đấu</SlideTitle>
      <div key={event.id} className="grid min-h-0 flex-1 gap-12 [grid-template-columns:1.3fr_1fr]">
        <Podium placements={event.placements} />
        <div className="flex min-h-0 flex-col gap-5">
          <p className="rise text-[2.25rem] font-bold text-accent" style={rise(1)}>{gameLabel(event.game)} · {shortDate(event.heldOn ?? event.startsAt) ?? ""}</p>
          <h3 className="rise font-display text-[5rem] uppercase text-white" style={rise(2)}>{event.name}</h3>
          {event.branchName ? <p className="rise text-[1.75rem] text-zinc-100" style={rise(3)}>Tại {event.branchName}</p> : null}
          {event.summaryContent ? <p className="rise line-clamp-5 text-[1.75rem] text-zinc-200" style={rise(4)}>{event.summaryContent}</p> : null}
          {event.prizePool ? <p className="rise mt-auto font-display text-[4rem] text-white" style={rise(5)}>Giải thưởng {prizeText(event.prizePool)}</p> : null}
        </div>
      </div>
      <Pager labels={data.completedEvents.map((item) => item.name)} active={index} />
    </div>
  );
}
