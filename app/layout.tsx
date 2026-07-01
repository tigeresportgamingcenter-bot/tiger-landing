import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Orbitron } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({ subsets: ["vietnamese"], variable: "--font-be-vietnam-pro", weight: ["400", "500", "600", "700", "800"] });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["700", "800", "900"] });
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

export const viewport: Viewport = { themeColor: "#070707", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${beVietnamPro.variable} ${orbitron.variable} font-sans antialiased`}>{children}</body></html>;
}
