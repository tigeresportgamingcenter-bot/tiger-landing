"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * next/image that eases in from a blur once it has downloaded. Images already loaded when the page hydrates,
 * and visitors without JavaScript, simply see the image. Not for hero or priority images.
 */
export function FadeImage({ className = "", onLoad, alt, ...props }: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    if (ref.current && !ref.current.complete) setState("pending");
  }, []);

  return (
    <Image
      {...props}
      alt={alt}
      ref={ref}
      className={`${className} ${state === "pending" ? "opacity-0" : state === "shown" ? "img-reveal" : ""}`}
      onLoad={(event) => {
        setState((current) => (current === "pending" ? "shown" : current));
        onLoad?.(event);
      }}
    />
  );
}
