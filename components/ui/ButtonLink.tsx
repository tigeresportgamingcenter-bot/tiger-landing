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
    ? "btn-sheen neon-hover bg-accent text-ground hover:bg-[#c98bff]"
    : "bg-white/10 text-white hover:bg-white/20";

  return (
    <a
      href={href}
      className={`magnetic inline-flex min-h-12 items-center justify-center gap-2 press rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide transition ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
