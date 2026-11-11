import type { TournamentEvent } from "@/types";

type RegistrationFields = Pick<TournamentEvent, "status" | "registrationOpen" | "registrationClosesAt" | "startsAt">;

/** True once the registration deadline has passed. No deadline means never closed by time. */
export function isRegistrationClosed(event: Pick<TournamentEvent, "registrationClosesAt">, now = Date.now()): boolean {
  if (!event.registrationClosesAt) return false;
  const closesAt = new Date(event.registrationClosesAt).getTime();
  return !Number.isNaN(closesAt) && closesAt <= now;
}

export interface CountdownTarget {
  at: string | null;
  label: string;
  pastLabel: string;
}

/**
 * What an event's countdown should count to: the registration deadline while registration is open and has one,
 * otherwise the start time. Running and finished events have no countdown.
 */
export function pickCountdown(event: RegistrationFields): CountdownTarget | null {
  if (event.status === "completed" || event.status === "ongoing") return null;
  if (event.registrationOpen && event.registrationClosesAt) {
    return { at: event.registrationClosesAt, label: "Đóng đăng ký sau", pastLabel: "Đã hết hạn đăng ký" };
  }
  return { at: event.startsAt, label: "Giải bắt đầu sau", pastLabel: "Đã đến giờ thi đấu" };
}
