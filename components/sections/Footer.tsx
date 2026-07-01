import { Container } from "@/components/ui/Container";
import { TigerMark } from "@/components/ui/TigerMark";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <Container className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3"><TigerMark /><div><p className="font-display text-sm font-black uppercase text-white">Tiger Esports</p><p className="mt-1 text-xs text-zinc-600">Chọn cơ sở gần bạn. Gọi Tiger. Vào trận ngay.</p></div></div>
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Tiger Esports. All rights reserved.</p>
      </Container>
    </footer>
  );
}
