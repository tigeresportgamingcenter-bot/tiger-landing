import Image from "next/image";
import type { LauncherData } from "./launcherTypes";
import { SlideTitle, rise } from "./slideKit";

const steps = ["Quét mã QR, điền biểu mẫu", "Quản lý cơ sở tiếp nhận và xử lý", "Tiger phản hồi qua số điện thoại hoặc Zalo của bạn"];

function Qr({ src, label, size }: { src: string; label: string; size: string }) {
  return (
    <figure className="text-center">
      <Image src={src} alt={`Mã QR: ${label}`} width={400} height={400} unoptimized className={size} />
      <figcaption className="mt-3 text-[1.875rem] font-extrabold text-white">{label}</figcaption>
    </figure>
  );
}

export function ComplaintSlide({ data }: { data: LauncherData }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <SlideTitle>Khiếu nại và góp ý</SlideTitle>
      <div className="grid min-h-0 flex-1 gap-14 [grid-template-columns:1.3fr_1fr]">
        <div className="flex flex-col gap-8">
          <p className="rise max-w-[16ch] font-display text-[7rem] uppercase text-white" style={rise(1)}>Chưa hài lòng? Nói cho Tiger biết.</p>
          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <li key={step} className="rise flex items-center gap-5 text-[2rem] font-semibold text-white" style={rise(index + 2)}>
                <span className="grid size-14 shrink-0 place-items-center bg-accent text-[2rem] font-extrabold text-ground">{index + 1}</span>{step}
              </li>
            ))}
          </ol>
          <p className="rise mt-auto text-[3rem] font-extrabold text-white" style={rise(5)}>Cần gấp? Gọi <span className="text-accent tabular-nums">{data.hotline}</span></p>
        </div>
        <div className="rise flex items-start justify-center gap-8" style={rise(2)}>
          {data.complaintQr ? <Qr src={data.complaintQr} label="Gửi khiếu nại" size="size-[22rem]" /> : null}
          {data.zaloQr ? <Qr src={data.zaloQr} label="Nhắn Zalo" size="size-[14rem]" /> : null}
        </div>
      </div>
    </div>
  );
}
