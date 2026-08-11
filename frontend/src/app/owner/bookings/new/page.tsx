"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, formatMoney } from "@/lib/api";
import type { Coupon, Route, Vessel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

function NewBookingForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [form, setForm] = useState({
    vesselId: "",
    routeId: searchParams.get("routeId") || "",
    couponCode: "",
    ownerNotes: "",
  });

  useEffect(() => {
    Promise.all([api.myApprovedVessels(), api.activeRoutes(), api.myCoupons()])
      .then(([v, r, c]) => {
        setVessels(v);
        setRoutes(r);
        setCoupons(c.filter((x) => x.status === "ACTIVE"));
        setForm((f) => ({
          ...f,
          vesselId: v[0] ? String(v[0].id) : "",
          routeId: f.routeId || (r[0] ? String(r[0].id) : ""),
          couponCode: c.find((x) => x.status === "ACTIVE")?.code || "",
        }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedRoute = useMemo(
    () => routes.find((r) => String(r.id) === form.routeId),
    [routes, form.routeId]
  );

  async function verifyCoupon() {
    if (!selectedRoute || !form.couponCode) return;
    setVerifyMsg("");
    setError("");
    try {
      const c = await api.verifyCoupon(form.couponCode, selectedRoute.serviceFee);
      setVerifyMsg(
        `${t("booking.new.couponValid")} ${formatMoney(c.amount)} (${t("booking.new.coversFee")} ${formatMoney(selectedRoute.serviceFee)})`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : t("booking.new.invalidCoupon"));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const booking = await api.createBooking({
        vesselId: Number(form.vesselId),
        routeId: Number(form.routeId),
        couponCode: form.couponCode,
        ownerNotes: form.ownerNotes || undefined,
      });
      setSuccess(
        `${t("booking.new.created")} ${booking.paymentStatus}`
      );
      setTimeout(() => router.push("/owner/bookings"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("booking.new.failed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("booking.new.title")}</h1>
        <p className="page-subtitle">{t("booking.new.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="info" message={verifyMsg} onClose={() => setVerifyMsg("")} />

      {vessels.length === 0 && (
        <div className="card mb-4 border-amber-200 bg-amber-50 text-amber-900">
          {t("booking.new.needVessel")}
        </div>
      )}

      {coupons.length === 0 && (
        <div className="card mb-4 border-amber-200 bg-amber-50 text-amber-900">
          {t("booking.new.needCoupon")}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="label-field">{t("booking.new.approvedVessel")}</label>
              <select
                className="input-field"
                required
                value={form.vesselId}
                onChange={(e) => setForm({ ...form, vesselId: e.target.value })}
              >
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} · {v.registrationNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">{t("booking.new.route")}</label>
              <select
                className="input-field"
                required
                value={form.routeId}
                onChange={(e) => setForm({ ...form, routeId: e.target.value })}
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.origin} → {r.destination}) —{" "}
                    {formatMoney(r.serviceFee)}
                  </option>
                ))}
              </select>
              {selectedRoute && (
                <div className="mt-3 rounded-lg border border-bd-green/15 bg-bd-green-light/40 p-3">
                  <p className="text-sm font-semibold text-bd-green-dark">
                    {selectedRoute.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {selectedRoute.origin} → {selectedRoute.destination}
                  </p>
                  {selectedRoute.description && (
                    <p className="mt-2 text-xs text-slate-500">{selectedRoute.description}</p>
                  )}
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-bd-green-dark">
                    {t("routes.pilotServices")}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedRoute.pilotServices || t("routes.pilotServicesDefault")}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="label-field">{t("booking.new.couponCode")}</label>
              <div className="flex gap-2">
                <input
                  className="input-field"
                  required
                  list="coupon-list"
                  value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                  placeholder={t("booking.new.couponPlaceholder")}
                />
                <button type="button" className="btn-secondary" onClick={verifyCoupon}>
                  {t("common.verify")}
                </button>
              </div>
              <datalist id="coupon-list">
                {coupons.map((c) => (
                  <option key={c.id} value={c.code}>
                    {formatMoney(c.amount)}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="label-field">{t("booking.new.notes")}</label>
              <textarea
                className="input-field min-h-[90px]"
                value={form.ownerNotes}
                onChange={(e) => setForm({ ...form, ownerNotes: e.target.value })}
                placeholder={t("booking.new.notesPlaceholder")}
              />
            </div>

            <button
              className="btn-primary w-full"
              type="submit"
              disabled={submitting || vessels.length === 0 || routes.length === 0}
            >
              {submitting ? t("booking.new.processing") : t("booking.new.submit")}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-bd-green to-bd-green-dark text-white">
            <h3 className="font-bold">{t("booking.new.feeSummary")}</h3>
            <p className="mt-3 text-sm text-white/85">{t("booking.new.feeRules")}</p>
            <div className="mt-5 rounded-lg bg-white/15 p-4">
              <p className="text-xs uppercase tracking-wide text-white/70">
                {t("booking.new.selectedFee")}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {selectedRoute ? formatMoney(selectedRoute.serviceFee) : t("common.none")}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-bd-green-dark">{t("booking.new.activeCoupons")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {coupons.length === 0 && (
                <li className="text-slate-500">{t("booking.new.noneCoupons")}</li>
              )}
              {coupons.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-bd-green/15 px-3 py-2 text-left hover:bg-bd-green-light"
                    onClick={() => setForm({ ...form, couponCode: c.code })}
                  >
                    <span className="font-mono font-semibold text-bd-green-dark">
                      {c.code}
                    </span>
                    <span className="float-right font-semibold">
                      {formatMoney(c.amount)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewBookingForm />
    </Suspense>
  );
}
