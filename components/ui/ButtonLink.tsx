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
    : "border border-white/20 bg-white/5 text-white hover:border-tiger-orange/70 hover:bg-white/10";

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
