"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { HeroMedia } from "@/components/ui/HeroMedia";
import type { Branch, HeroContent } from "@/types";

const statusLabels: Record<Branch["status"], string> = {
  active: "Đang hoạt động",
  "temporarily-closed": "Tạm ngưng",
  unverified: "Chưa xác minh",
};

interface HeroStageProps {
  media: Pick<HeroContent, "mediaType" | "image" | "video">;
  branches: Branch[];
  fallbackPhone: string;
  children: ReactNode;
}

export function HeroStage({ media, branches, fallbackPhone, children }: HeroStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const active = branches.find((branch) => branch.id === activeId) ?? null;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const context = gsap.context(() => {
        gsap.fromTo("[data-hero-motion]", { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.13,
          clearProps: "all",
        });
      }, stage);
      cleanup = () => context.revert();
    });
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <section ref={stageRef} id="trang-chu" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ground pb-24 pt-20 md:pb-10">
      <HeroMedia mediaType={media.mediaType} image={media.image} video={media.video} />
      {branches.map((branch) => branch.image ? (
        <Image key={branch.id} src={branch.image.src} alt="" aria-hidden="true" fill sizes="100vw" className={`object-cover transition-opacity duration-700 ${branch.id === activeId ? "opacity-100" : "opacity-0"}`} />
      ) : null)}
      <div className="absolute inset-0 bg-ground/50" />
      <Container className="relative flex flex-1 flex-col justify-between gap-10 pt-10">
        <div className="my-auto">{children}</div>
        <div id="co-so" className="scroll-mt-24">
          <p className="text-lg font-semibold text-white">Chọn cơ sở gần bạn</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Chọn cơ sở">
            {branches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                aria-pressed={branch.id === activeId}
                onClick={() => setActiveId((current) => current === branch.id ? null : branch.id)}
                className={`press motion-choice min-h-12 rounded-lg px-5 text-base font-semibold transition ${branch.id === activeId ? "neon-box bg-paper text-ground" : "bg-white/15 text-white hover:bg-white/25"}`}
              >
                {branch.name}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {active ? (
              <div className="motion-panel mt-4 max-w-2xl rounded-lg bg-paper p-5 text-ground sm:p-6">
                <h2 className="font-display text-4xl uppercase">{active.name}</h2>
                <p className="mt-2 text-base font-semibold text-zinc-700">{active.area} · {statusLabels[active.status]}</p>
                <p className="mt-2 text-lg leading-snug">{active.address}</p>
                <p className="mt-1 text-base text-zinc-700">{active.openingHours ?? "Giờ mở cửa chưa công bố"}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a href={`tel:${active.phone ?? fallbackPhone}`} aria-label={`Gọi ${active.phone ? active.name : "hotline Tiger"}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-base font-semibold text-ground transition hover:bg-[#c98bff]"><Phone className="size-4" />{active.phone ? "Gọi cơ sở" : "Gọi hotline"}</a>
                  {active.mapUrl ? <a href={active.mapUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ground px-6 text-base font-semibold text-paper transition hover:bg-black">Chỉ đường <ArrowUpRight className="size-4" /></a> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
