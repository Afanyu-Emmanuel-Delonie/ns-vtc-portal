import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="card flex items-center justify-between rounded-full px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate)]">
            NS VTC Portal
          </p>
          <p className="text-sm text-[var(--slate)]">Public applications</p>
        </div>
        <a className="text-sm font-semibold text-[var(--navy)]" href="/login">
          Staff login
        </a>
      </div>
      <div className="flex-1 py-8">{children}</div>
    </main>
  );
}
