import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  className = "",
  asChild = false,
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
  children?: ReactNode;
}) {
  const styles: Record<Variant, string> = {
    primary: "bg-navy !text-white shadow-[0_10px_20px_rgba(0,50,98,0.18)] hover:bg-navy-hover",
    secondary: "bg-surface !text-ink border border-border hover:bg-canvas",
    ghost: "bg-transparent !text-ink hover:bg-black/5",
  };

  const mergedClassName = `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`.trim();

  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, {
      className: `${mergedClassName} ${(children.props.className ?? "")}`.trim(),
    });
  }

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
}
