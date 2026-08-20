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
import { useSidebar } from "./SidebarContext";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Listings", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/recruiters", label: "Recruiters", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart2 },
  { href: "/settings", label: "Profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`fixed inset-y-0 left-0 flex flex-col bg-navy text-white transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[280px]"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center border-b border-white/10 py-5 ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {!collapsed && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">NS VTC</p>
            <h1 className="font-heading mt-1 text-xl font-bold">Portal</h1>
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className={`mt-4 grid gap-1 ${collapsed ? "px-2" : "px-3"}`}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`font-heading flex items-center rounded-xl py-2.5 text-sm font-semibold transition ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              } ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className={`mt-auto border-t border-white/10 py-4 ${collapsed ? "px-2" : "px-3"}`}>
        <button
          title={collapsed ? "Sign out" : undefined}
          onClick={() => {
            document.cookie = "ns_vtc_auth=; Max-Age=0; path=/";
            router.push("/login");
          }}
          className={`font-heading flex w-full border border-amber-50 items-center rounded-full py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white justify-center px-0 gap-2
          `}
        >
          <LogOut size={18} />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
