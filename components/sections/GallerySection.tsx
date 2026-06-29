import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPreview } from "@/components/ui/MediaPreview";
import type { GalleryItem } from "@/types";

export function GallerySection({ items }: { items: GalleryItem[] }) {
  if (!items.length) return null;
  return (
    <section className="section-space bg-zinc-950">
      <Container>
        <SectionHeading eyebrow="Không gian thực tế" title="Một góc Tiger Esports" description="Hình ảnh đã được Tiger Esports xác minh và cho phép hiển thị." />
        <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {items.map((item) => <figure key={item.id} className="min-w-[82vw] snap-center overflow-hidden rounded-2xl border border-white/10 bg-black sm:min-w-0"><div className="relative aspect-[4/3]">{item.mediaType === "image" && item.image ? <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 639px) 82vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" /> : item.video ? <MediaPreview video={item.video} title={item.title} /> : null}</div><figcaption className="p-4"><p className="text-sm font-semibold text-zinc-300">{item.title}</p>{item.caption ? <p className="mt-1 text-xs leading-5 text-zinc-500">{item.caption}</p> : null}</figcaption></figure>)}
        </div>
        {items.length > 1 ? <p className="mt-3 text-xs text-zinc-600 sm:hidden">Vuốt để xem thêm →</p> : null}
      </Container>
    </section>
  );
}
