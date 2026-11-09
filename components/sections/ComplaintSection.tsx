import { ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { complaintSteps } from "@/lib/complaints";

export function ComplaintSection({ hotline }: { hotline: string }) {
  return (
    <section id="khieu-nai" className="bg-accent py-20 text-ground sm:py-28">
      <Container>
        <div className="reveal grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-5xl uppercase sm:text-6xl lg:text-7xl">Khiếu nại</h2>
            <p className="mt-4 max-w-[44ch] text-balance text-xl leading-snug">Trải nghiệm chưa tốt ở Tiger? Hãy cho chúng tôi biết. Mỗi phản ánh được ghi nhận, giao người phụ trách và phản hồi lại bạn.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/khieu-nai" className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ground px-6 text-base font-bold text-paper transition hover:bg-black">Gửi khiếu nại <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/khieu-nai#tra-cuu" className="press inline-flex min-h-12 items-center justify-center rounded-lg bg-ground/10 px-6 text-base font-bold text-ground transition hover:bg-ground/20">Tra cứu tiến độ</Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-base font-semibold"><PhoneCall className="size-4" aria-hidden="true" />Cần hỗ trợ gấp? Gọi <a href={`tel:${hotline}`} className="underline">{hotline}</a></p>
          </div>
          <ol className="grid content-start gap-3 lg:col-span-7">
            {complaintSteps.map((step) => (
              <li key={step.title} className="rounded-lg bg-ground p-6 text-paper">
                <h3 className="font-display text-4xl uppercase">{step.title}</h3>
                <p className="mt-2 max-w-[52ch] text-lg leading-snug text-zinc-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
