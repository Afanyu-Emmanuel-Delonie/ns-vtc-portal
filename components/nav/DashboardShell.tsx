"use client";

import { type ReactNode } from "react";
import { Menu } from "lucide-react";
import { SidebarProvider, useSidebar } from "./SidebarContext";

function Shell({ children }: { children: ReactNode }) {
  const { collapsed, toggleMobile } = useSidebar();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        collapsed ? "md:pl-[68px]" : "md:pl-[280px]"
      }`}
    >
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
        <button
          onClick={toggleMobile}
          className="rounded-lg p-1.5 text-slate transition hover:bg-canvas"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate">NS VTC</p>
          <p className="font-heading text-sm font-bold leading-none">Portal</p>
        </div>
      </header>

      <main className="px-4 py-4 md:px-6 md:py-6">{children}</main>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  );
}
