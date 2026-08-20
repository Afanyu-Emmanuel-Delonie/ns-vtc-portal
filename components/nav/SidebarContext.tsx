"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const SidebarContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
}>({ collapsed: false, toggle: () => {}, mobileOpen: false, toggleMobile: () => {}, closeMobile: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggle: () => setCollapsed((c) => !c),
        mobileOpen,
        toggleMobile: () => setMobileOpen((o) => !o),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
