import { Container } from "@/components/ui/Container";
import { TigerMark } from "@/components/ui/TigerMark";

export function Footer() {
  return (
    <footer className="bg-panel py-10">
      <Container className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3"><TigerMark /><div><p className="text-lg font-extrabold uppercase tracking-wide text-white">Tiger Esports</p><p className="mt-1 text-base text-zinc-400">Chọn cơ sở gần bạn. Gọi Tiger. Vào trận ngay.</p></div></div>
        <p className="text-base text-zinc-400">© {new Date().getFullYear()} Tiger Esports. All rights reserved.</p>
      </Container>
    </footer>
  );
}
