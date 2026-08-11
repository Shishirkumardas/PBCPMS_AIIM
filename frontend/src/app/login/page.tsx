"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import Alert from "@/components/Alert";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("owner@example.com");
  const [password, setPassword] = useState("Owner@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-bd-green-deep via-bd-green to-bd-green-mid p-10 text-white lg:flex">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-bd-green">
              PB
            </div>
            <div>
              <p className="text-xl font-bold">{t("app.name")}</p>
              <p className="text-sm text-white/80">{t("app.taglineShort")}</p>
            </div>
          </div>
          <LanguageSwitcher variant="light" />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-snug">{t("login.heroTitle")}</h1>
          <p className="mt-4 max-w-md text-white/85">{t("login.heroText")}</p>
        </div>
        <p className="text-xs text-white/70">{t("common.footer")}</p>
      </div>

      <div className="flex w-full items-center justify-center bg-bd-cream p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-2xl font-bold text-bd-green-dark">{t("login.pageTitle")}</p>
            <LanguageSwitcher />
          </div>
          <div className="mb-4 hidden justify-end lg:flex">
            <LanguageSwitcher />
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-bd-green-dark">{t("login.title")}</h2>
            <p className="page-subtitle">{t("login.subtitle")}</p>

            <Alert type="error" message={error} onClose={() => setError("")} />

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label-field">{t("common.email")}</label>
                <input
                  className="input-field"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="label-field">{t("common.password")}</label>
                <input
                  className="input-field"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <button className="btn-primary w-full" disabled={loading}>
                {loading ? t("login.signingIn") : t("login.title")}
              </button>
            </form>

            <div className="mt-6 rounded-lg bg-bd-green-light p-3 text-xs text-bd-green-dark">
              <p className="font-semibold">{t("login.demo")}</p>
              <p className="mt-1">Admin: admin@pbcpms.com / Admin@123</p>
              <p>Owner: owner@example.com / Owner@123</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded bg-white px-2 py-1 font-semibold shadow-sm"
                  onClick={() => {
                    setEmail("admin@pbcpms.com");
                    setPassword("Admin@123");
                  }}
                >
                  {t("login.fillAdmin")}
                </button>
                <button
                  type="button"
                  className="rounded bg-white px-2 py-1 font-semibold shadow-sm"
                  onClick={() => {
                    setEmail("owner@example.com");
                    setPassword("Owner@123");
                  }}
                >
                  {t("login.fillOwner")}
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              {t("login.newOwner")}{" "}
              <Link href="/register" className="font-semibold text-bd-green">
                {t("login.createAccount")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
