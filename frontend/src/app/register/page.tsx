"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import Alert from "@/components/Alert";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-bd-green-light via-bd-cream to-white p-6">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-bd-green text-xl font-bold text-white shadow">
            PB
          </div>
          <h1 className="text-2xl font-bold text-bd-green-dark">{t("register.title")}</h1>
          <p className="page-subtitle">{t("register.subtitle")}</p>
        </div>

        <div className="card">
          <Alert type="error" message={error} onClose={() => setError("")} />

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label-field">{t("common.fullName")}</label>
              <input
                className="input-field"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">{t("common.email")}</label>
              <input
                className="input-field"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">{t("common.phone")}</label>
              <input
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="label-field">{t("common.password")}</label>
              <input
                className="input-field"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t("register.passwordHint")}
              />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("register.creating") : t("register.create")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t("register.haveAccount")}{" "}
            <Link href="/login" className="font-semibold text-bd-green">
              {t("register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
