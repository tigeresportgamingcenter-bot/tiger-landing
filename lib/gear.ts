import type { GearCategory, GearPriceUnit } from "@/types";

export const gearCategories: Array<{ value: GearCategory; label: string }> = [
  { value: "mouse", label: "Chuột" },
  { value: "keyboard", label: "Bàn phím" },
  { value: "controller", label: "Tay cầm" },
  { value: "combo", label: "Combo" },
  { value: "mousepad", label: "Pad chuột" },
  { value: "headset", label: "Tai nghe" },
  { value: "other", label: "Phụ kiện khác" },
];

export const gearPriceUnits: Array<{ value: GearPriceUnit; label: string }> = [
  { value: "hour", label: "giờ" },
  { value: "day", label: "ngày" },
  { value: "turn", label: "lượt" },
];

export const gearCategoryLabel = (category: string) => gearCategories.find((item) => item.value === category)?.label ?? category;
export const gearPriceUnitLabel = (unit: string) => gearPriceUnits.find((item) => item.value === unit)?.label ?? unit;
