import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin", "vietnamese"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tigeresports.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tiger Esports | Cyber Game cao cấp tại Thanh Hóa & Sầm Sơn",
  description: "Tiger Esports là hệ thống Cyber Game cao cấp tại Thanh Hóa và Sầm Sơn với 4 cơ sở, dàn máy thi đấu, combo giờ chơi, ưu đãi nạp tiền và giải đấu cộng đồng định kỳ.",
  keywords: ["Tiger Esports", "cyber game Thanh Hóa", "phòng máy Sầm Sơn", "esports Thanh Hóa", "phòng net gaming"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "vi_VN", url: "/", siteName: "Tiger Esports", title: "Tiger Esports | Cyber Game cao cấp tại Thanh Hóa & Sầm Sơn", description: "Hệ thống Cyber Game 4 cơ sở với dàn máy thi đấu, combo giờ chơi, ưu đãi nạp tiền và giải đấu cộng đồng.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tiger Esports" }] },
  twitter: { card: "summary_large_image", title: "Tiger Esports", description: "Cyber Game cao cấp cho game thủ Thanh Hóa và Sầm Sơn.", images: ["/opengraph-image"] },
};

export const viewport: Viewport = { themeColor: "#0a0612", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${archivo.variable} font-sans antialiased`}>{children}</body></html>;
}
