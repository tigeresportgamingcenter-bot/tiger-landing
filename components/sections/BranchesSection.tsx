import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Branch } from "@/types";

const statusLabels: Record<Branch["status"], string> = {
  active: "Đang hoạt động",
  "temporarily-closed": "Tạm ngưng",
  unverified: "Chưa xác minh",
};

export function BranchesSection({ branches, fallbackPhone }: { branches: Branch[]; fallbackPhone: string }) {
  return (
    <section id="co-so" className="section-space bg-zinc-950">
      <Container>
        <SectionHeading eyebrow="Hệ thống Tiger" title="Chọn chiến địa gần bạn" description="Bốn cơ sở tại Thanh Hóa và Sầm Sơn, sẵn sàng cho mọi cuộc hẹn cùng đồng đội." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch, index) => (
            <article key={branch.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-tiger-orange/50">
              {branch.image ? <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden"><Image src={branch.image.src} alt={branch.image.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /></div> : null}
              <span className="absolute right-4 top-2 font-display text-6xl font-black text-white/[0.035]">0{index + 1}</span>
              <MapPin className="size-7 text-tiger-orange" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{branch.area}</p>
              <div className="mt-2 flex items-center justify-between gap-3"><h3 className="font-display text-2xl font-black uppercase text-white">{branch.name}</h3><span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">{statusLabels[branch.status]}</span></div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{branch.description}</p>
              <p className="mt-5 min-h-[62px] rounded-lg bg-black/40 px-3 py-2.5 text-xs leading-5 text-zinc-400">{branch.address}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><Clock3 className="size-4 text-tiger-orange" />{branch.openingHours ?? "Giờ mở cửa chưa công bố"}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={branch.mapUrl ?? undefined} target="_blank" rel="noreferrer" className="card-action">Chỉ đường <ArrowUpRight className="size-4" /></a>
                <a href={`tel:${branch.phone ?? fallbackPhone}`} className="card-action" aria-label={`Gọi ${branch.phone ? branch.name : "hotline Tiger"}`}><Phone className="size-4" /> {branch.phone ? "Gọi cơ sở" : "Gọi hotline"}</a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
