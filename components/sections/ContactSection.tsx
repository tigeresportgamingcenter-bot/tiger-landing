import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { FadeImage } from "@/components/ui/FadeImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import type { ContactContent, ContentImage, FaqItem, SocialLinks } from "@/types";

const formatHotline = (phone: string) => phone.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1.$2.$3");

interface ContactSectionProps {
  socialLinks: SocialLinks;
  content: ContactContent;
  image: ContentImage | null;
  faqItems: FaqItem[];
}

export function ContactSection({ socialLinks, content, image, faqItems }: ContactSectionProps) {
  const contacts = [
    { label: "Hotline", description: socialLinks.hotline ? formatHotline(socialLinks.hotline) : "Chưa cập nhật", href: socialLinks.hotline ? `tel:${socialLinks.hotline}` : null },
    { label: "Zalo", description: content.zaloLabel, href: socialLinks.zalo },
    { label: "Facebook", description: content.facebookLabel, href: socialLinks.facebook },
    { label: "Chỉ đường", description: content.mapsLabel, href: socialLinks.googleMaps ?? "/co-so" },
  ];

  return (
    <section id="lien-he" className="ambient bg-panel py-20 sm:py-28">
      <span id="faq" className="block" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="reveal-left lg:col-span-6">
            <h2 className="font-display text-5xl uppercase text-white sm:text-6xl lg:text-7xl">Thông tin cần biết</h2>
            <div className="mt-8 grid gap-2">
              {faqItems.map((item) => (
                <details key={item.id} name="faq" className="neon-run group rounded-lg bg-ground px-5 py-4 open:bg-paper open:text-ground">
                  <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                    {item.question}<ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-base leading-7 text-zinc-300 group-open:text-zinc-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="reveal-right lg:col-span-6">
            <div className="relative flex min-h-[600px] items-end overflow-hidden rounded-lg bg-ground p-4">
              {image ? <FadeImage src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /> : null}
              <div className="absolute inset-0 bg-ground/30" />
              <div className="relative w-full rounded-lg bg-paper p-6 text-ground">
                <h2 className="font-display text-4xl uppercase">{content.titleLines.join(" ")}</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {contacts.map(({ label, description, href }, index) => (
                    <li key={label} style={{ "--i": index } as CSSProperties} className="stagger-pop">
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="block h-full rounded-lg bg-white px-4 py-3 transition hover:bg-zinc-200">
                          <strong className="block text-lg">{label}</strong><span className="text-base text-zinc-700">{description}</span>
                        </a>
                      ) : (
                        <div className="h-full rounded-lg px-4 py-3 text-zinc-600"><strong className="block text-lg">{label}</strong><span className="text-base">Chưa cập nhật</span></div>
                      )}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={socialLinks.hotline ? `tel:${socialLinks.hotline}` : "#co-so"} className="mt-4 w-full">Gọi Tiger ngay</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
