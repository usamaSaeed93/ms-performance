"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // 👇 grab `open` instead of `state`
  const { open, isMobile } = useSidebar();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("admin_theme") as "light" | "dark" | null) ??
      "light";

    setTheme(savedTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("admin_theme", next);
  };

  // No shell for login page
  if (pathname === "/admin/login") {
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Light
            </span>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-visible">{children}</main>
    </div>
  );
}

