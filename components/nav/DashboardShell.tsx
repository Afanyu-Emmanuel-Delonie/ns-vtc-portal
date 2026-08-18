"use client";

import { type ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";

function Shell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className={`min-h-screen transition-all duration-300 ${collapsed ? "pl-[68px]" : "pl-[280px]"}`}>
      <main className="px-6 py-6">{children}</main>
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
