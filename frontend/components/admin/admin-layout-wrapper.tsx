"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminShell } from "@/components/admin/admin-shell";
import "@/styles/admin.css";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";

  // For login and auth pages, don't show sidebar
  if (isAuthPage) {
    return <div className="admin-theme">{children}</div>;
  }

  return (
    <div className="admin-theme">
      <SidebarProvider>
        <AppSidebar />

        {/* This is the main area that sits next to the sidebar */}
        <SidebarInset>
          <AdminShell>{children}</AdminShell>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
