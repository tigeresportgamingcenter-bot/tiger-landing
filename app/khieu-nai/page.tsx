import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { ComplaintForm } from "@/components/ui/ComplaintForm";
import { ComplaintTracker } from "@/components/ui/ComplaintTracker";
import { Container } from "@/components/ui/Container";
import { complaintSteps } from "@/lib/complaints";
import { getSiteContent } from "@/services/contentService";

export const metadata: Metadata = {
  title: "Khiếu nại | Tiger Esports",
  description: "Gửi khiếu nại và tra cứu tiến độ xử lý tại Tiger Esports.",
  alternates: { canonical: "/khieu-nai" },
};

export const dynamic = "force-dynamic";

export default async function ComplaintPage() {
  const content = await getSiteContent();
  const hotline = content.socialLinks.hotline ?? "";
  return (
    <>
      <main className="bg-ground py-12 sm:py-20">
        <Container>
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 text-base font-semibold text-zinc-300 transition hover:text-white"><ArrowLeft className="size-4" aria-hidden="true" />Về trang chủ</Link>
          <h1 className="mt-4 font-display text-6xl uppercase text-white sm:text-8xl">Khiếu nại</h1>
          <p className="mt-4 max-w-[56ch] text-balance text-xl leading-snug text-zinc-300">Cho Tiger biết điều chưa hài lòng. Chúng tôi ghi nhận từng phản ánh, giao người phụ trách và phản hồi lại bạn.</p>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ComplaintForm branches={content.branches.map((branch) => ({ id: branch.id, name: branch.name }))} hotline={hotline} />
            </div>
            <div className="grid content-start gap-12 lg:col-span-5">
              <section>
                <h2 className="font-display text-4xl uppercase text-white">Quy trình xử lý</h2>
                <ol className="mt-4 grid gap-2">
                  {complaintSteps.map((step) => (
                    <li key={step.title} className="rounded-lg bg-panel p-5">
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-base leading-snug text-zinc-300">{step.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section id="tra-cuu" className="scroll-mt-24">
                <h2 className="font-display text-4xl uppercase text-white">Tra cứu tiến độ</h2>
                <div className="mt-4"><ComplaintTracker /></div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
