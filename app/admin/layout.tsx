import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị Tiger Esports",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#070707] text-white">{children}</div>;
}
