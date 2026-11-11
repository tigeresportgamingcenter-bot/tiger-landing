import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CountUp } from "@/components/ui/CountUp";
import { HeroStage } from "@/components/ui/HeroStage";
import type { Branch, HeroContent } from "@/types";

interface HeroSectionProps {
  content: HeroContent;
  branches: Branch[];
  minPricePerHour: number | null;
  hotline: string;
}

export function HeroSection({ content, branches, minPricePerHour, hotline }: HeroSectionProps) {
  const facts: ReactNode[] = [
    branches.length > 0 ? `${branches.length} cơ sở` : null,
    ...content.facts,
    minPricePerHour ? <>Giá từ <CountUp value={minPricePerHour} divisor={1000} maximumFractionDigits={1} suffix="K" />/giờ</> : null,
  ].filter((fact) => fact !== null);

  return (
    <HeroStage media={content} branches={branches} fallbackPhone={hotline}>
      <h1 className="font-display text-[clamp(4.5rem,14vw,10rem)] uppercase text-white">
        <span className="line-mask"><span className="line-rise" style={{ "--d": "60ms" } as CSSProperties}>{content.title}</span></span>
        {content.highlightedTitle ? <span className="line-mask"><span className="line-rise-neon neon-text block text-accent" style={{ "--d": "220ms" } as CSSProperties}>{content.highlightedTitle}</span></span> : null}
      </h1>
      <p className="hero-enter hero-enter-2 mt-5 max-w-[32ch] text-xl font-medium leading-snug text-white sm:text-2xl">{content.description}</p>
      <ul className="mt-5 flex max-w-xl flex-wrap gap-x-6 gap-y-1 text-base font-medium text-zinc-200">
        {facts.map((fact, index) => <li key={index} style={{ "--i": index + 2 } as CSSProperties} className="enter">{fact}</li>)}
      </ul>
      <div className="hero-enter hero-enter-4 mt-7 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`tel:${hotline}`} className="pulse-glow">Gọi ngay</ButtonLink>
        <ButtonLink href="/bang-gia" variant="secondary">Xem giá và ưu đãi</ButtonLink>
      </div>
    </HeroStage>
  );
}
