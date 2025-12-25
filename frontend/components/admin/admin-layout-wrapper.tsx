"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminShell } from "@/components/admin/admin-shell";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // For login page, don't show sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      {/* This is the main area that sits next to the sidebar */}
      <SidebarInset>
        <AdminShell>{children}</AdminShell>
      </SidebarInset>
    </SidebarProvider>
  );
}

