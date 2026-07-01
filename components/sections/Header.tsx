import { Container } from "@/components/ui/Container";
import { TigerMark } from "@/components/ui/TigerMark";
import type { NavigationItem, SiteSettings } from "@/types";

interface HeaderProps {
  navigation: NavigationItem[];
  siteSettings: SiteSettings;
  hotline: string;
}

export function Header({ navigation, siteSettings, hotline }: HeaderProps) {
  return (
    <header className="sticky inset-x-0 top-0 z-40 -mb-[105px] border-b border-white/10 bg-black/85 backdrop-blur-md sm:-mb-[121px] lg:-mb-20">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <a href="#trang-chu" className="flex items-center gap-3" aria-label="Tiger Esports - Trang chủ">
            <TigerMark />
            <span className="font-display text-sm font-black uppercase tracking-wider text-white sm:text-base">{siteSettings.brandName}</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Điều hướng chính">
            {navigation.map((item) => <a key={item.href} href={item.href} className="text-sm font-semibold text-zinc-300 transition hover:text-tiger-orange">{item.label}</a>)}
          </nav>
          <a href={`tel:${hotline}`} className="inline-flex min-h-12 items-center rounded-lg border border-tiger-orange/60 px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-tiger-orange">{siteSettings.primaryActionLabel}</a>
        </div>
        <nav className="-mx-5 flex gap-5 overflow-x-auto border-t border-white/5 px-5 py-2.5 lg:hidden" aria-label="Điều hướng mobile">
          {navigation.map((item) => <a key={item.href} href={item.href} className="shrink-0 text-xs font-semibold text-zinc-400">{item.label}</a>)}
        </nav>
      </Container>
    </header>
  );
}
