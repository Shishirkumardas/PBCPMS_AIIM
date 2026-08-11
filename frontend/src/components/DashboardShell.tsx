"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import Loading from "./Loading";

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

export default function DashboardShell({
  role,
  nav,
  children,
}: {
  role: "ADMIN" | "OWNER";
  nav: NavItem[];
  children: ReactNode;
}) {
  const { user, loading, logout, isAdmin, isOwner } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role === "ADMIN" && !isAdmin) router.replace("/owner");
    if (role === "OWNER" && !isOwner) router.replace("/admin");
  }, [loading, user, role, isAdmin, isOwner, router]);

  if (loading || !user) {
    return <Loading label={t("common.preparing")} />;
  }

  return (
    <div className="min-h-screen bg-bd-cream">
      <div className="bg-bd-green-deep text-xs text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <span className="font-medium">{t("app.name")} · {t("app.tagline")}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{t("app.fullName")}</span>
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-28px)] max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-bd-green/10 bg-white md:flex md:flex-col">
          <div className="border-b border-bd-green/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bd-green text-lg font-bold text-white shadow">
                PB
              </div>
              <div>
                <p className="text-sm font-bold text-bd-green-dark">{t("app.name")}</p>
                <p className="text-xs text-slate-500">
                  {role === "ADMIN" ? t("portal.admin") : t("portal.owner")}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== `/${role.toLowerCase()}` &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-bd-green text-white shadow-sm"
                      : "text-slate-600 hover:bg-bd-green-light hover:text-bd-green-dark"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-bd-green/10 p-4">
            <div className="mb-3 rounded-lg bg-bd-green-light p-3">
              <p className="text-sm font-semibold text-bd-green-dark">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-bd-green">
                {user.role === "ADMIN" ? t("role.admin") : t("role.owner")}
              </p>
            </div>
            <button onClick={logout} className="btn-secondary w-full">
              {t("common.signOut")}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-bd-green/10 bg-white px-4 py-3 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold text-bd-green-dark">{t("app.name")}</p>
                <p className="text-xs text-slate-500">{user.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="compact" />
                <button onClick={logout} className="btn-secondary px-3 py-1.5 text-xs">
                  {t("common.signOut")}
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                    pathname === item.href
                      ? "bg-bd-green text-white"
                      : "bg-bd-green-light text-bd-green-dark"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>

          <footer className="border-t border-bd-green/10 bg-white px-4 py-3 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {t("app.name")} · {t("common.footer")}
          </footer>
        </div>
      </div>
    </div>
  );
}
