"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "@/lib/api";
import type { Coupon, User } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function AdminCouponsPage() {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    ownerId: "",
    amount: "",
    code: "",
    expiresAt: "",
    notes: "",
  });

  async function load() {
    setLoading(true);
    try {
      const [c, o] = await Promise.all([api.allCoupons(), api.listOwners()]);
      setCoupons(c);
      setOwners(o);
      if (!form.ownerId && o.length > 0) {
        setForm((f) => ({ ...f, ownerId: String(o[0].id) }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await api.issueCoupon({
        ownerId: Number(form.ownerId),
        amount: Number(form.amount),
        code: form.code || undefined,
        expiresAt: new Date(form.expiresAt).toISOString(),
        notes: form.notes || undefined,
      });
      setSuccess(t("coupons.issued"));
      setForm((f) => ({ ...f, amount: "", code: "", notes: "" }));
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  const defaultExpiry = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 16);
  })();

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("coupons.admin.title")}</h1>
        <p className="page-subtitle">{t("coupons.admin.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card">
          <h2 className="text-lg font-bold text-bd-green-dark">{t("coupons.issue")}</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label-field">{t("common.owner")}</label>
              <select
                className="input-field"
                required
                value={form.ownerId}
                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">{t("coupons.amount")}</label>
              <input
                className="input-field"
                type="number"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">{t("coupons.codeOptional")}</label>
              <input
                className="input-field"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder={t("coupons.codeAuto")}
              />
            </div>
            <div>
              <label className="label-field">{t("coupons.expiresAt")}</label>
              <input
                className="input-field"
                type="datetime-local"
                required
                value={form.expiresAt || defaultExpiry}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">{t("coupons.notes")}</label>
              <textarea
                className="input-field min-h-[70px]"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <button className="btn-primary w-full" type="submit">
              {t("coupons.issue")}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <Loading />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("common.code")}</th>
                    <th>{t("common.owner")}</th>
                    <th>{t("common.amount")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.expires")}</th>
                    <th>{t("common.issued")}</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono font-semibold text-bd-green-dark">
                        {c.code}
                      </td>
                      <td>
                        <p>{c.ownerName}</p>
                        <p className="text-xs text-slate-500">{c.ownerEmail}</p>
                      </td>
                      <td className="font-semibold">{formatMoney(c.amount)}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="text-xs">{formatDate(c.expiresAt)}</td>
                      <td className="text-xs">{formatDate(c.issuedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
