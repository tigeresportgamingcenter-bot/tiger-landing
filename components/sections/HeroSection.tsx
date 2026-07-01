import { ArrowDown, Gamepad2, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HeroMedia } from "@/components/ui/HeroMedia";
import type { HeroContent } from "@/types";

interface HeroSectionProps {
  content: HeroContent;
  branchCount: number;
  tierCount: number;
  hotline: string;
}

export function HeroSection({ content, branchCount, tierCount, hotline }: HeroSectionProps) {
  const safeBranchCount = branchCount > 0 ? branchCount : 4;
  const safeTierCount = tierCount > 0 ? tierCount : 4;
  return (
    <section id="trang-chu" className="hero-grid relative flex min-h-[760px] items-center overflow-hidden pt-20">
      <HeroMedia mediaType={content.mediaType} image={content.image} video={content.video} />
      <div className={`absolute inset-0 ${content.image || content.video ? "bg-gradient-to-r from-black via-black/85 to-black/45" : "bg-[radial-gradient(circle_at_72%_45%,rgba(239,43,35,0.2),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(255,106,0,0.12),transparent_30%)]"}`} />
      <div className="absolute right-[-10%] top-[22%] hidden select-none font-display text-[22vw] font-black leading-none text-white/[0.025] lg:block">T</div>
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <div className="hero-enter hero-enter-1 mb-6 inline-flex items-center gap-2 rounded-full border border-tiger-orange/30 bg-tiger-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
            <Zap className="size-4" /> {content.eyebrow}
          </div>
          <h1 className="hero-enter hero-enter-2 font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {content.title} <span className="neon-title text-gradient">{content.highlightedTitle}</span>
          </h1>
          <p className="hero-enter hero-enter-3 mt-7 max-w-xl text-lg font-medium leading-8 text-zinc-300 sm:text-xl">{content.description}</p>
          <p className="hero-enter hero-enter-3 mt-3 max-w-xl leading-7 text-zinc-500">{content.supportingText}</p>
          <div className="hero-enter hero-enter-4 mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#co-so">Xem cơ sở <ArrowDown className="size-4" /></ButtonLink>
            <ButtonLink href={`tel:${hotline}`} variant="secondary">Gọi ngay <Gamepad2 className="size-4" /></ButtonLink>
          </div>
          <div className="hero-enter hero-enter-5 mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7">
            <div><p className="font-display text-2xl font-black text-white"><AnimatedCounter value={safeBranchCount} /></p><p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">Cơ sở</p></div>
            <div><p className="font-display text-2xl font-black text-white"><AnimatedCounter value={safeTierCount} /></p><p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">Hạng máy</p></div>
            <div><p className="font-display text-2xl font-black text-white">READY</p><p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{content.readinessLabel}</p></div>
          </div>
        </div>
      </Container>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-tiger-orange/20 bg-black/75 py-3 backdrop-blur-sm">
        <div className="neon-marquee flex min-w-max items-center whitespace-nowrap font-display text-[11px] font-black uppercase tracking-[0.2em] text-orange-300 sm:text-sm sm:tracking-[0.28em]">
          {[0, 1].map((group) => <div key={group} aria-hidden={group === 1} className="flex min-w-max shrink-0 items-center">{["Cyber Game 24/7", "Cấu hình thi đấu", "Không gian game thủ", "Tiger Esports Thanh Hóa"].map((item) => <span key={`${group}-${item}`} className="flex shrink-0 items-center"><span className="neon-running-text px-5 sm:px-7">{item}</span><span className="shrink-0 text-tiger-red">◆</span></span>)}</div>)}
        </div>
      </div>
    </section>
  );
}
