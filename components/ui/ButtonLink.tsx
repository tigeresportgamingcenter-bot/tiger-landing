import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", external = false, className = "" }: ButtonLinkProps) {
  const styles = variant === "primary"
    ? "bg-gradient-to-r from-tiger-red to-tiger-orange text-white shadow-glow hover:brightness-110"
    : "border border-white/25 bg-white/[0.06] text-white hover:border-tiger-orange hover:bg-tiger-orange/10 hover:shadow-[0_0_24px_-6px_rgba(255,106,0,0.5)]";

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide transition ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
