import { Swords, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CommunityHighlight, ContentImage, Tournament } from "@/types";

const highlightIcons = { trophy: Trophy, users: Users };
const maxDescriptionLength = 150;

function cleanGameDescription(value: string) {
  const withoutEmoji = value
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (withoutEmoji.length <= maxDescriptionLength) return withoutEmoji;
  const shortened = withoutEmoji.slice(0, maxDescriptionLength).replace(/\s+\S*$/, "");
  return `${shortened}...`;
}

export function CommunitySection({ tournaments, highlights, image }: { tournaments: Tournament[]; highlights: CommunityHighlight[]; image: ContentImage | null }) {
  return (
    <section id="cong-dong" className="section-space bg-zinc-950">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Cộng đồng esports" title="Không chỉ là một phòng máy" description="Tiger Esports là nơi game thủ gặp gỡ, cọ sát kỹ năng và chia sẻ cùng một niềm đam mê." />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {highlights.map((highlight) => {
                const Icon = highlightIcons[highlight.icon];
                return (
                  <div key={highlight.id} className="flex items-center gap-4 rounded-xl border border-white/10 p-4">
                    <Icon className="size-6 shrink-0 text-tiger-orange" />
                    <div>
                      <p className="font-bold text-white">{highlight.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{highlight.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {image ? (
              <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tournaments.map((tournament, index) => (
              <article key={tournament.id} className="group flex min-h-44 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 transition hover:border-tiger-orange/40 sm:p-6">
                <div className="flex items-center justify-between">
                  <Swords className="size-6 text-tiger-orange" />
                  <span className="font-display text-xs font-bold text-zinc-700">0{index + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-black uppercase text-white">{tournament.game}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [overflow:hidden]">
                  {cleanGameDescription(tournament.description)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
