"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ContentImage, ContentVideo } from "@/types";

interface HeroMediaProps {
  mediaType: "image" | "video";
  image: ContentImage | null;
  video: ContentVideo | null;
}

export function HeroMedia({ mediaType, image, video }: HeroMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const canPlayVideo = mediaType === "video" && video && (video.provider === "upload" || video.provider === "external") && !videoFailed && !reducedMotion;
  const fallbackImage = video?.poster ?? image;

  if (canPlayVideo) {
    return (
      <video
        className="absolute inset-0 size-full object-cover"
        src={video.src}
        poster={video.poster?.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={fallbackImage?.alt ?? "Video không gian Tiger Esports"}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  return fallbackImage ? <Image src={fallbackImage.src} alt={fallbackImage.alt} fill priority quality={82} sizes="100vw" className="object-cover" /> : null;
}
