import { CountUp } from "@/components/ui/CountUp";
import { bareAmount, formatNumbersInText } from "@/lib/formatText";

/** Prize text from the admin: a plain number counts up as money, free text is shown with grouped digits. */
export function Money({ value, className }: { value: string; className?: string }) {
  const amount = bareAmount(value);
  if (amount === null) return <span className={className}>{formatNumbersInText(value)}</span>;
  return <span className={className}><CountUp value={amount} />đ</span>;
}
