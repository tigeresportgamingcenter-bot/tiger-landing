"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({ label, pendingLabel = "Đang lưu...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>
      {pending ? pendingLabel : label}
    </button>
  );
}
