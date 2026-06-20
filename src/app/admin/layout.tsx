"use client";

import { StarMark } from "@/components/Header";
import { API_BASE } from "@/lib/api";
import {
  AdminUser,
  clearAuth,
  getToken,
  getUser,
  isAuthenticated,
} from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdOutlinePets,
  MdDashboard,
  MdReceiptLong,
  MdLogout,
  MdMenu,
} from "react-icons/md";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: MdDashboard,
    exact: true,
  },
  { label: "Applications", href: "/admin/applications", icon: MdReceiptLong },
  // { label: "Pets", href: "/admin/pets", icon: MdOutlinePets },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setLocalUser] = useState<AdminUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Client-side route guard: bounce to /auth if there's no token.
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        const next = encodeURIComponent(pathname);
        router.replace(`/auth?next=${next}`);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!mounted) return;

        if (!response.ok) {
          clearAuth();
          router.replace("/auth");
          return;
        }

        const result = await response.json();

        const currentUser =
          result.data?.user ?? result.data ?? result.user ?? result;

        setLocalUser(currentUser);
        setReady(true);
      } catch (error) {
        clearAuth();
        router.replace("/auth");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/auth");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf8f3] text-[#6a5e51]">
        Loading…
      </div>
    );
  }

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <StarMark />
        <div>
          <p className="font-display text-lg font-bold leading-none text-[#271f17]">
            Northstar Lending
          </p>
          <p className="text-xs text-[#6a5e51]">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#d97706] text-white"
                  : "text-[#6a5e51] hover:bg-[#f3ead9]/60 hover:text-[#271f17]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e7d7bf]/40 px-4 py-4">
        {user && (
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium text-[#271f17]">
              {user.full_name}
            </p>
            <p className="truncate text-xs text-[#6a5e51]">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <MdLogout className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fbf8f3]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#e7d7bf]/40 bg-white lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-sand-dark/40 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#271f17] hover:bg-[#f3ead9]/60"
            aria-label="Open menu"
          >
            <MdMenu className="h-6 w-6" />
          </button>
          <span className="font-display font-bold text-[#271f17]">Admin</span>
          <span className="w-10" />
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
