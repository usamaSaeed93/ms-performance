"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // 👇 grab `open` instead of `state`
  const { open, isMobile } = useSidebar();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const isAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";
    if (!token && !isAuthPage) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // No shell for login and auth pages
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";
  if (isAuthPage) {
    return <>{children}</>;
  }

  // ✅ use `open` to decide which width to offset by
  const sidebarOffsetClass = isMobile
    ? "ml-0"
    : open
    ? "ml-[var(--sidebar-width)]"
    : "ml-[var(--sidebar-width-icon)]";

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-slate-50 transition-[margin-left] duration-200",
        sidebarOffsetClass
      )}
    >
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-visible">{children}</main>
    </div>
  );
}

