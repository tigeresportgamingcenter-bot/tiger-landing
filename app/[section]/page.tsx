import HomePage from "../page";
import { SECTION_IDS } from "@/lib/sections";

export const revalidate = 60;
export const dynamicParams = false;

/** Clean section URLs (/bang-gia, /khieu-nai...) show the home page; SectionRouter scrolls to the section. */
export function generateStaticParams() {
  return SECTION_IDS.filter((section) => section !== "giai-dau").map((section) => ({ section }));
}

export default async function SectionPage() {
  return HomePage();
}
