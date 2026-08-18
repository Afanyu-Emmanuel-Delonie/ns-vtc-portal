import type { ReactNode } from "react";

export function Modal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card rounded-2xl p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">
          Modal
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
