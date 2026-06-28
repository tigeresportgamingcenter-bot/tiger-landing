import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Orbitron } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({ subsets: ["vietnamese"], variable: "--font-be-vietnam-pro", weight: ["400", "500", "600", "700", "800"] });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["700", "800", "900"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tiger-esports.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tiger Esports - Cyber Game cao cấp cho game thủ",
  description: "Chuỗi cyber game Tiger Esports với cấu hình mạnh, không gian hiện đại, giải đấu cộng đồng và nhiều combo hấp dẫn tại Thanh Hóa, Sầm Sơn.",
  keywords: ["Tiger Esports", "cyber game Thanh Hóa", "phòng máy Sầm Sơn", "esports Thanh Hóa", "phòng net gaming"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "vi_VN", url: "/", siteName: "Tiger Esports", title: "Tiger Esports - Cyber Game cao cấp cho game thủ", description: "Cấu hình mạnh, không gian hiện đại và cộng đồng esports sôi động tại Thanh Hóa, Sầm Sơn.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tiger Esports" }] },
  twitter: { card: "summary_large_image", title: "Tiger Esports", description: "Cyber Game cao cấp cho game thủ Thanh Hóa và Sầm Sơn.", images: ["/opengraph-image"] },
};

export const viewport: Viewport = { themeColor: "#070707", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${beVietnamPro.variable} ${orbitron.variable} font-sans antialiased`}>{children}</body></html>;
}
