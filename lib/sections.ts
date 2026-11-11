import { navigation } from "@/data/siteContent";

/** "#bang-gia" and "/bang-gia" both give "bang-gia"; "/" and "#trang-chu" give "". */
export function sectionIdFromHref(href: string): string {
  const id = href.replace(/^\/?#?/, "").split(/[?#]/)[0];
  return id === "trang-chu" ? "" : id;
}

export const sectionPath = (id: string) => (id ? `/${id}` : "/");

/** Home-page sections that have their own clean URL, taken from the menu so there is one list. */
export const SECTION_IDS: string[] = navigation.map((item) => sectionIdFromHref(item.href)).filter(Boolean);
