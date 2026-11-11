import { AutoVideo } from "@/components/ui/AutoVideo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Countdown } from "@/components/ui/Countdown";
import { FadeImage } from "@/components/ui/FadeImage";
import { RegisterButton } from "@/components/ui/RegisterButton";
import { Money } from "@/components/tournament/Money";
import { ambientVideo } from "@/data/spaceVideos";
import { gameLabel } from "@/lib/games";
import { formatVnd } from "@/lib/formatText";
import { isRegistrationClosed, pickCountdown } from "@/lib/registration";
import type { TournamentEvent } from "@/types";

const timeZone = "Asia/Ho_Chi_Minh";

/** "15/11", "Thứ Bảy", "08:00" in the shop's time zone. The time is empty when only a date is known. */
function whenParts(event: TournamentEvent) {
  const value = event.startsAt ?? event.heldOn;
  if (!value) return null;
  const date = new Date(value);
  const dayParts = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", timeZone }).formatToParts(date);
  const part = (type: string) => dayParts.find((item) => item.type === type)?.value ?? "";
  return {
    day: `${part("day")}/${part("month")}`,
    weekday: new Intl.DateTimeFormat("vi-VN", { weekday: "long", timeZone }).format(date),
    time: event.startsAt ? new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(date) : null,
  };
}

/** The next tournament as a large panel: big date, countdown tiles, prize block and the register button. */
export function FeaturedEvent({ event, swapped }: { event: TournamentEvent; swapped: boolean }) {
  const visual = event.image ?? event.video?.poster ?? null;
  const when = whenParts(event);
  const countdown = pickCountdown(event);
  const canRegister = event.registrationOpen && event.registrationUrl;
  const fee = event.entryFee === null ? null : event.entryFee === 0 ? "Miễn phí" : formatVnd(event.entryFee);
  const feeLine = [fee ? `Phí tham dự ${fee}` : null, event.format].filter(Boolean).join(" · ");

  return (
    <article className={`card-lift relative overflow-hidden rounded-2xl bg-panel ring-1 ring-accent/30 ${swapped ? "panel-in" : ""}`}>
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <AutoVideo src={ambientVideo.video} poster={ambientVideo.poster} className="size-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-panel via-panel/85 to-panel/50" />
      </div>
      <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[16rem_minmax(0,1fr)_17rem] lg:items-center lg:gap-8">
        {visual ? (
          <div style={{ viewTransitionName: `tour-${event.slug}` }} className="relative aspect-video overflow-hidden rounded-lg bg-ground ring-1 ring-white/10 lg:aspect-[4/5]">
            <FadeImage src={visual.src} alt={visual.alt} fill sizes="(max-width: 1023px) 100vw, 272px" className="object-cover" />
          </div>
        ) : null}

        <div className="min-w-0">
          <span className={`inline-block px-3 py-1 text-sm font-extrabold uppercase tracking-wider ${event.registrationOpen ? "bg-accent text-ground ring-2 ring-accent/40 ring-offset-2 ring-offset-panel" : "bg-white/10 text-white ring-1 ring-white/20"}`}>
            {event.registrationOpen ? "Mở đăng ký" : "Sắp diễn ra"}
          </span>
          <h4 className="mt-3 font-display text-4xl uppercase leading-none text-white sm:text-5xl">{event.name}</h4>

          {when ? (
            <p className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="font-display text-7xl uppercase leading-[0.85] text-accent sm:text-8xl">{when.day}</span>
              <span className="pb-1 text-lg font-bold leading-snug text-zinc-100 sm:text-xl">{when.weekday}{when.time ? <><br />{when.time}</> : null}</span>
            </p>
          ) : <p className="mt-5 text-lg font-semibold text-zinc-300">Lịch đang cập nhật</p>}

          <p className="mt-3 text-lg font-semibold text-accent">{[gameLabel(event.game), event.branchName].filter(Boolean).join(" · ")}</p>

          {countdown ? <div className="mt-5"><Countdown startsAt={countdown.at} large label={countdown.label} pastLabel={countdown.pastLabel} /></div> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {canRegister ? <RegisterButton href={event.registrationUrl as string} closesAt={event.registrationClosesAt} initialClosed={isRegistrationClosed(event)} pulse>Đăng ký ngay</RegisterButton> : null}
            <ButtonLink href={`/giai-dau/${event.slug}`} variant="secondary">Chi tiết</ButtonLink>
          </div>
        </div>

        {event.prizePool || feeLine ? (
          <div className="bg-accent p-5 text-ground">
            {event.prizePool ? (
              <>
                <p className="text-base font-extrabold uppercase tracking-wider">Giải thưởng</p>
                <Money value={event.prizePool} className="mt-1 block text-3xl font-extrabold leading-none tabular-nums sm:text-4xl lg:text-3xl xl:text-4xl" />
              </>
            ) : null}
            {feeLine ? <p className={`${event.prizePool ? "mt-3" : ""} text-sm font-bold uppercase tracking-wide`}>{feeLine}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
