import { MapPinned, MessageCircle, PhoneCall } from "lucide-react";
import type { SocialLinks } from "@/types";

export function MobileCtaBar({ socialLinks }: { socialLinks: SocialLinks }) {
  const items = [
    { label: "Gọi", href: socialLinks.hotline ? `tel:${socialLinks.hotline}` : null, icon: PhoneCall },
    { label: socialLinks.zalo ? "Zalo" : "Zalo chưa có", href: socialLinks.zalo, icon: MessageCircle },
    { label: "Chỉ đường", href: socialLinks.googleMaps ?? "#co-so", icon: MapPinned },
  ];

  return (
    <nav aria-label="Liên hệ nhanh" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {items.map(({ label, href, icon: Icon }) => href ? (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] px-2 text-xs font-bold text-white transition active:bg-tiger-orange">
            <Icon className="size-4 text-tiger-orange" /> {label}
          </a>
        ) : (
          <span key={label} aria-disabled="true" className="flex min-h-12 cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-white/[0.025] px-1 text-[10px] font-semibold text-zinc-600">
            <Icon className="size-4" /> {label}
          </span>
        ))}
      </div>
    </nav>
  );
}
