import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "brand";

export function Badge({
  className = "",
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  const styles: Record<Tone, string> = {
    neutral: "bg-border/60 text-ink",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    brand: "bg-navy/10 text-navy",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[tone]} ${className}`}
      {...props}
    />
  );
}
