import type { CSSProperties } from "react";
import { ArrowUpRight, MessageCircle, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { complaintSteps } from "@/data/complaintSteps";

interface ComplaintSectionProps {
  /** Public Google Form link. When missing, customers are asked to call or message instead. */
  formUrl: string | null;
  hotline: string;
  zaloHref: string | null;
}

const primaryButton = "press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ground px-6 text-base font-bold text-paper transition hover:bg-black";
const secondaryButton = "press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ground/10 px-6 text-base font-bold text-ground transition hover:bg-ground/20";

export function ComplaintSection({ formUrl, hotline, zaloHref }: ComplaintSectionProps) {
  return (
    <section id="khieu-nai" className="bg-accent py-20 text-ground [--bar:#0a0612] sm:py-28">
      <Container>
        <div className="reveal grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-5xl uppercase sm:text-6xl lg:text-7xl">Khiếu nại</h2>
            <p className="mt-4 max-w-[44ch] text-balance text-xl leading-snug">Trải nghiệm chưa tốt ở Tiger? Hãy cho chúng tôi biết. Mỗi phản ánh được ghi nhận, giao người phụ trách và phản hồi lại bạn.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {formUrl ? (
                <a href={formUrl} target="_blank" rel="noreferrer" className={primaryButton}>Gửi khiếu nại <ArrowUpRight className="size-4" aria-hidden="true" /><span className="sr-only">(mở biểu mẫu Google trong tab mới)</span></a>
              ) : zaloHref ? (
                <a href={zaloHref} target="_blank" rel="noreferrer" className={primaryButton}><MessageCircle className="size-4" aria-hidden="true" />Nhắn Zalo để khiếu nại</a>
              ) : null}
              <a href={`tel:${hotline}`} className={formUrl ? secondaryButton : primaryButton}><PhoneCall className="size-4" aria-hidden="true" />Gọi {hotline}</a>
            </div>
            <p className="mt-5 text-base font-semibold">{formUrl ? "Cần hỗ trợ gấp? Hãy gọi hotline thay vì chờ biểu mẫu." : "Chúng tôi sẽ ghi nhận và phản hồi lại bạn sớm nhất."}</p>
          </div>
          <ol className="grid content-start gap-3 lg:col-span-7">
            {complaintSteps.map((step, index) => (
              <li key={step.title} style={{ "--i": index } as CSSProperties} className="stagger-right rounded-lg bg-ground p-6 text-paper">
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
