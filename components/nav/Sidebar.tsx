"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  BarChart2,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSidebar } from "./SidebarContext";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Listings", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/recruiters", label: "Employers", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart2 },
  { href: "/settings", label: "Profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();

  async function signOut() {
    if (auth) {
      await firebaseSignOut(auth).catch(() => {});
    }
    document.cookie = "ns_vtc_auth=; Max-Age=0; path=/";
    router.push("/login");
  }

  const navContent = (isMobile: boolean) => (
    <aside
      className={`flex h-full flex-col bg-navy text-white ${
        isMobile ? "w-[280px]" : `transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[280px]"}`
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-white/10 py-5 ${
          !isMobile && collapsed ? "justify-center px-0" : "justify-between px-5"
        }`}
      >
        {(isMobile || !collapsed) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">NS VTC</p>
            <h1 className="font-heading mt-1 text-xl font-bold">Portal</h1>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={toggle}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`mt-4 grid gap-1 ${!isMobile && collapsed ? "px-2" : "px-3"}`}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={isMobile ? closeMobile : undefined}
              title={!isMobile && collapsed ? label : undefined}
              className={`font-heading flex items-center rounded-xl py-2.5 text-sm font-semibold transition ${
                !isMobile && collapsed ? "justify-center px-0" : "gap-3 px-3"
              } ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} />
              {(isMobile || !collapsed) && label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className={`mt-auto border-t border-white/10 py-4 ${!isMobile && collapsed ? "px-2" : "px-3"}`}>
        <button
          title={!isMobile && collapsed ? "Sign out" : undefined}
          onClick={signOut}
          className={`font-heading flex w-full items-center rounded-xl py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white ${
            !isMobile && collapsed ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          <LogOut size={18} />
          {(isMobile || !collapsed) && "Sign out"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — fixed, always visible */}
      <div className="fixed inset-y-0 left-0 z-30 hidden md:flex">
        {navContent(false)}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent(true)}
      </div>
    </>
  );
}
