import { ArrowDown, Gamepad2, Zap } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { HeroContent } from "@/types";

interface HeroSectionProps {
  content: HeroContent;
  branchCount: number;
  tierCount: number;
  hotline: string;
}

export function HeroSection({ content, branchCount, tierCount, hotline }: HeroSectionProps) {
  return (
    <section id="trang-chu" className="hero-grid relative flex min-h-[760px] items-center overflow-hidden pt-20">
      {content.image ? <Image src={content.image.src} alt={content.image.alt} fill priority quality={82} sizes="100vw" className="object-cover" /> : null}
      <div className={`absolute inset-0 ${content.image ? "bg-gradient-to-r from-black via-black/85 to-black/45" : "bg-[radial-gradient(circle_at_72%_45%,rgba(239,43,35,0.2),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(255,106,0,0.12),transparent_30%)]"}`} />
      <div className="absolute right-[-10%] top-[22%] hidden select-none font-display text-[22vw] font-black leading-none text-white/[0.025] lg:block">T</div>
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-tiger-orange/30 bg-tiger-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
            <Zap className="size-4" /> {content.eyebrow}
          </div>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {content.title} <span className="text-gradient">{content.highlightedTitle}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-zinc-300 sm:text-xl">{content.description}</p>
          <p className="mt-3 max-w-xl leading-7 text-zinc-500">{content.supportingText}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#co-so">Xem cơ sở <ArrowDown className="size-4" /></ButtonLink>
            <ButtonLink href={`tel:${hotline}`} variant="secondary">Gọi ngay <Gamepad2 className="size-4" /></ButtonLink>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7">
            {[[String(branchCount).padStart(2, "0"), "Cơ sở"], [String(tierCount).padStart(2, "0"), "Hạng máy"], ["READY", content.readinessLabel]].map(([value, label]) => (
              <div key={label}><p className="font-display text-2xl font-black text-white">{value}</p><p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{label}</p></div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
