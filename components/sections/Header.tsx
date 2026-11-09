import { Container } from "@/components/ui/Container";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { TigerMark } from "@/components/ui/TigerMark";
import type { NavigationItem, SiteSettings } from "@/types";

interface HeaderProps {
  navigation: NavigationItem[];
  siteSettings: SiteSettings;
  hotline: string;
}

export function Header({ navigation, siteSettings, hotline }: HeaderProps) {
  return (
    <header className="sticky inset-x-0 top-0 z-40 -mb-16 bg-ground/95 sm:-mb-20">
      <div className="scroll-progress neon-glow absolute inset-x-0 top-0 h-1.5 bg-accent" />
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <a href="#trang-chu" className="flex items-center gap-3" aria-label="Tiger Esports - Trang chủ">
            <TigerMark />
            <span className="text-base font-extrabold uppercase tracking-wide text-white">{siteSettings.brandName}</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Điều hướng chính">
            {navigation.map((item) => <a key={item.href} href={item.href} className="text-sm font-semibold text-zinc-300 transition hover:text-accent">{item.label}</a>)}
          </nav>
          <MobileMenu navigation={navigation} />
          <a href={`tel:${hotline}`} className="hidden min-h-12 items-center neon-hover rounded-lg bg-accent text-ground px-4 text-sm font-bold transition hover:bg-[#c98bff] sm:inline-flex">{siteSettings.primaryActionLabel}</a>
        </div>
      </Container>
    </header>
  );
}
