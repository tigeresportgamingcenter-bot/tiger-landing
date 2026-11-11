import type { CSSProperties } from "react";
import { AutoVideo } from "@/components/ui/AutoVideo";
import { Container } from "@/components/ui/Container";
import { FadeImage } from "@/components/ui/FadeImage";
import { spaceBackdrop } from "@/data/spaceVideos";
import type { SpaceVideo } from "@/types/space";

/** Mosaic of short looping clips from inside the shop. The first featured clip takes a 2x2 block. */
export function SpaceSection({ videos }: { videos: SpaceVideo[] }) {
  if (!videos.length) return null;

  return (
    <section id="khong-gian" className="ambient relative bg-ground py-20 sm:py-28">
      <FadeImage src={spaceBackdrop.src} alt="" aria-hidden="true" fill sizes="100vw" className="-z-20 object-cover opacity-[0.12]" />
      <Container>
        <div className="reveal max-w-3xl">
          <h2 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">Không gian Tiger</h2>
          <p className="mt-4 max-w-[52ch] text-balance text-lg leading-snug text-zinc-300">Dàn máy thi đấu, màn hình tần số quét cao và không khí game thủ thật, quay ngay tại quán.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {videos.map((clip, index) => (
            <figure
              key={clip.id}
              style={{ "--i": index } as CSSProperties}
              className={`card-lift stagger-item group relative aspect-video overflow-hidden rounded-xl bg-panel ring-1 ring-white/10 ${clip.featured ? "col-span-2 lg:row-span-2 lg:aspect-auto" : ""}`}
            >
              <AutoVideo src={clip.video} poster={clip.poster} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ground/90 to-transparent px-4 pb-3 pt-10">
                <figcaption className="text-sm font-bold text-white sm:text-base">{clip.title}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
