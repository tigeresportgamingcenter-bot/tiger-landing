export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "month" | "datetime-local" | "url" | "textarea" | "checkbox" | "select" | "image" | "video" | "promotion-tiers";
  required?: boolean;
  options?: Array<string | { label: string; value: string }>;
  /** visibility = the "show on website" switches, rendered first. status = optional / technical settings. */
  group?: "main" | "media" | "status" | "details" | "visibility";
  hint?: string;
}

export type AdminRecord = Record<string, unknown>;

export type ModuleKey = "overview" | "media" | "branches" | "promotions" | "tournaments" | "honors" | "leaderboard" | "gear" | "pc_tiers" | "gallery" | "faq";

export interface AdminModuleConfig {
  key: ModuleKey;
  label: string;
  title: string;
  /** One sentence in plain language, shown under the title. */
  hint?: string;
  resource?: string;
  /** Columns the list needs. The edit form loads the full record separately. */
  listColumns?: string;
  addLabel?: string;
}
