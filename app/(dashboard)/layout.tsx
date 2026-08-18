import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/nav/Sidebar";
import { DashboardShell } from "@/components/nav/DashboardShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("ns_vtc_auth")?.value === "demo";

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <Sidebar />
      {children}
    </DashboardShell>
  );
}
