"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import Loading from "@/components/Loading";
import ShipIllustration from "@/components/ShipIllustration";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.role === "ADMIN") router.replace("/admin");
    else if (user?.role === "OWNER") router.replace("/owner");
  }, [user, loading, router]);

  if (loading || user) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left green panel with ship */}
      <aside className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-bd-green-deep via-bd-green to-bd-green-mid px-6 py-8 text-white lg:w-[42%] lg:min-h-screen lg:px-10 lg:py-10">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-10 bottom-40 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-bd-green shadow">
            PB
          </div>
          <div>
            <p className="text-lg font-bold">{t("app.name")}</p>
            <p className="text-xs text-white/80">{t("app.taglineShort")}</p>
          </div>
        </div>

        <div className="relative z-10 my-8 flex flex-1 flex-col items-center justify-center lg:my-0">
          <div className="w-full max-w-md drop-shadow-2xl">
            <ShipIllustration className="h-auto w-full" />
          </div>
          <p className="mt-4 max-w-sm text-center text-sm text-white/80">
            {t("app.fullName")}
          </p>
        </div>

        <p className="relative z-10 hidden text-xs text-white/60 lg:block">
          {t("common.footer")}
        </p>
      </aside>

      {/* Right content */}
      <div className="flex w-full flex-1 flex-col bg-bd-cream">
        <header className="flex flex-wrap items-center justify-end gap-2 px-4 py-5 sm:px-8">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-lg bg-bd-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-bd-green-dark"
          >
            {t("common.login")}
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-bd-green/30 px-4 py-2 text-sm font-semibold text-bd-green hover:bg-bd-green-light"
          >
            {t("common.register")}
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-10 lg:px-14">
          <div className="mb-4 inline-flex w-fit items-center rounded-full bg-bd-green-light px-4 py-1 text-xs font-semibold uppercase tracking-wider text-bd-green-dark">
            {t("landing.badge")}
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-bd-green-dark md:text-4xl lg:text-5xl">
            {t("landing.title")}
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
            {t("landing.subtitle")}
          </p>

          <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            {[
              {
                title: t("landing.ownerTitle"),
                desc: t("landing.ownerDesc"),
              },
              {
                title: t("landing.adminTitle"),
                desc: t("landing.adminDesc"),
              },
              {
                title: t("landing.secureTitle"),
                desc: t("landing.secureDesc"),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-bd-green/10 bg-white p-5 text-left shadow-card"
              >
                <h3 className="font-bold text-bd-green-dark">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">
              {t("landing.enter")}
            </Link>
            <Link href="/register" className="btn-secondary">
              {t("landing.ownerReg")}
            </Link>
          </div>
        </main>

        <footer className="px-4 py-4 text-center text-xs text-slate-500 sm:px-8 sm:text-left">
          {t("landing.demo")}
        </footer>
      </div>
    </div>
  );
}
