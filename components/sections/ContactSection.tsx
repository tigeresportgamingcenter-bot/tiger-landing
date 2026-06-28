import { Facebook, MapPinned, MessageCircle, PhoneCall } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { ContactContent, SocialLinks } from "@/types";

const formatHotline = (phone: string) => phone.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1.$2.$3");

export function ContactSection({ socialLinks, content }: { socialLinks: SocialLinks; content: ContactContent }) {
  const contacts = [
    { label: "Facebook", description: content.facebookLabel, href: socialLinks.facebook, icon: Facebook, ready: true },
    { label: "Zalo", description: content.zaloLabel, href: socialLinks.zalo, icon: MessageCircle, ready: Boolean(socialLinks.zalo) },
    { label: "Chỉ đường", description: content.mapsLabel, href: socialLinks.googleMaps ?? "#co-so", icon: MapPinned, ready: true },
    { label: "Hotline", description: socialLinks.hotline ? formatHotline(socialLinks.hotline) : "Chưa cập nhật", href: socialLinks.hotline ? `tel:${socialLinks.hotline}` : null, icon: PhoneCall, ready: Boolean(socialLinks.hotline) },
  ];
  return (
    <section id="lien-he" className="section-space bg-black">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(239,43,35,0.18),transparent_35%)] p-7 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-tiger-orange">{content.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">{content.titleLines.map((line, index) => <span key={line} className={index === content.titleLines.length - 1 ? "block text-gradient" : "block"}>{line}</span>)}</h2>
              <ButtonLink href="#co-so" className="mt-8">Khám phá cơ sở</ButtonLink>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map(({ label, description, href, icon: Icon, ready }) => ready && href ? (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-tiger-orange/50">
                  <span className="grid size-11 place-items-center rounded-lg bg-white/5 text-tiger-orange"><Icon className="size-5" /></span><span><strong className="block text-sm text-white">{label}</strong><span className="mt-1 block text-xs text-zinc-500">{description}</span></span>
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 opacity-55">
                  <span className="grid size-11 place-items-center rounded-lg bg-white/5 text-zinc-500"><Icon className="size-5" /></span><span><strong className="block text-sm text-zinc-300">{label}</strong><span className="mt-1 block text-xs text-zinc-600">Chưa cập nhật</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
