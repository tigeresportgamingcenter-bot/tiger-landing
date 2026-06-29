"use client";

import { ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ContentVideo } from "@/types";

function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null);
    return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}

export function MediaPreview({ video, title, className = "" }: { video: ContentVideo; title: string; className?: string }) {
  const [active, setActive] = useState(false);
  const youtubeUrl = video.provider === "youtube" ? youtubeEmbedUrl(video.src) : null;
  const embeddable = video.provider === "upload" || Boolean(youtubeUrl) || video.provider === "facebook";

  if (active && embeddable) {
    if (video.provider === "upload") return <video controls preload="metadata" poster={video.poster?.src} className={`h-full w-full bg-black object-contain ${className}`}><source src={video.src} /></video>;
    const src = youtubeUrl ?? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.src)}&show_text=false`;
    return <iframe src={src} title={title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen className={`h-full w-full border-0 bg-black ${className}`} />;
  }

  return (
    <div className={`group relative h-full w-full overflow-hidden bg-zinc-950 ${className}`}>
      {video.poster ? <Image src={video.poster.src} alt={video.poster.alt} fill sizes="(max-width: 639px) 86vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,.16),transparent_45%)]" />}
      <div className="absolute inset-0 bg-black/35" />
      {embeddable ? <button type="button" onClick={() => setActive(true)} aria-label={`Phát video ${title}`} className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full border border-white/25 bg-black/65 text-white shadow-glow transition hover:scale-105 hover:border-tiger-orange"><Play className="ml-1 size-7 fill-current" /></button> : <a href={video.src} target="_blank" rel="noreferrer" className="absolute inset-0 m-auto flex h-12 w-fit items-center gap-2 rounded-full border border-white/25 bg-black/70 px-5 text-sm font-bold text-white hover:border-tiger-orange"><ExternalLink className="size-4" />Xem video</a>}
    </div>
  );
}
