import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroStage } from "@/components/ui/HeroStage";
import { formatHourlyPrice } from "@/lib/formatPrice";
import type { Branch, HeroContent } from "@/types";

interface HeroSectionProps {
  content: HeroContent;
  branches: Branch[];
  minPricePerHour: number | null;
  hotline: string;
}

export function HeroSection({ content, branches, minPricePerHour, hotline }: HeroSectionProps) {
  const facts = [
    branches.length > 0 ? `${branches.length} cơ sở` : null,
    ...content.facts,
    minPricePerHour ? `Giá từ ${formatHourlyPrice(minPricePerHour)}/giờ` : null,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <HeroStage media={content} branches={branches} fallbackPhone={hotline}>
      <h1 data-hero-motion className="font-display text-[clamp(4.5rem,14vw,10rem)] uppercase text-white">
        {content.title}<br /><span className="neon-text text-accent">{content.highlightedTitle}</span>
      </h1>
      <p data-hero-motion className="mt-5 max-w-[32ch] text-xl font-medium leading-snug text-white sm:text-2xl">{content.description}</p>
      <ul data-hero-motion className="mt-5 flex max-w-xl flex-wrap gap-x-6 gap-y-1 text-base font-medium text-zinc-200">
        {facts.map((fact) => <li key={fact}>{fact}</li>)}
      </ul>
      <div data-hero-motion className="mt-7 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`tel:${hotline}`}>Gọi ngay</ButtonLink>
        <ButtonLink href="#bang-gia" variant="secondary">Xem giá và ưu đãi</ButtonLink>
      </div>
    </HeroStage>
  );
}
