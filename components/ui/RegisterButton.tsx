"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** Turns true the moment the deadline passes, without a page reload. `initialClosed` comes from the server render. */
function useDeadlineClosed(closesAt: string | null, initialClosed: boolean): boolean {
  const [closed, setClosed] = useState(initialClosed);

  useEffect(() => {
    const deadline = closesAt ? new Date(closesAt).getTime() : Number.NaN;
    if (Number.isNaN(deadline)) return;
    const check = () => setClosed(Date.now() >= deadline);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [closesAt]);

  return closed;
}

interface RegisterButtonProps {
  href: string;
  closesAt: string | null;
  initialClosed: boolean;
  /** Slow glow ring, for the main call to action. */
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}

/** The register button; after the deadline it turns into a dimmed "Đã đóng đăng ký" label. */
export function RegisterButton({ href, closesAt, initialClosed, pulse = false, className = "", children }: RegisterButtonProps) {
  const closed = useDeadlineClosed(closesAt, initialClosed);

  if (closed) {
    return (
      <span aria-disabled="true" role="link" className={`inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-lg bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wide text-zinc-500 ${className}`}>
        Đã đóng đăng ký
      </span>
    );
  }
  return <ButtonLink href={href} external className={`${pulse ? "pulse-glow" : ""} ${className}`}>{children}</ButtonLink>;
}
