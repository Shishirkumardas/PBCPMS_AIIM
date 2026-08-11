"use client";

import { useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "@/lib/api";
import type { Booking, Pilot } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function AdminBookingsPage() {
  const { t } = useI18n();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assignId, setAssignId] = useState<number | null>(null);
  const [pilotId, setPilotId] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [b, p] = await Promise.all([api.allBookings(), api.availablePilots()]);
      setBookings(b);
      setPilots(p);
      if (p.length && !pilotId) setPilotId(String(p[0].id));
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

  async function approveAndAssign(id: number) {
    if (!pilotId) {
      setError(t("bookings.selectPilot"));
      return;
    }
    try {
      await api.reviewBooking(id, {
        status: "ASSIGNED",
        pilotId: Number(pilotId),
      });
      setSuccess(t("bookings.assignedOk"));
      setAssignId(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  async function reject() {
    if (!rejectId) return;
    try {
      await api.reviewBooking(rejectId, {
        status: "REJECTED",
        rejectionReason: reason,
      });
      setSuccess(t("bookings.rejectedOk"));
      setRejectId(null);
      setReason("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  async function complete(id: number) {
    try {
      await api.reviewBooking(id, { status: "COMPLETED" });
      setSuccess(t("bookings.completedOk"));
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("bookings.admin.title")}</h1>
        <p className="page-subtitle">{t("bookings.admin.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("bookings.id")}</th>
                <th>{t("common.owner")} / {t("common.vessel")}</th>
                <th>{t("common.route")}</th>
                <th>{t("common.payment")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.pilot")}</th>
                <th>{t("common.created")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {t("bookings.none")}
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-xs">#{b.id}</td>
                  <td>
                    <p className="font-semibold">{b.ownerName}</p>
                    <p className="text-xs text-slate-500">
                      {b.vesselName} · {b.vesselRegistration}
                    </p>
                    {b.couponCode && (
                      <p className="text-xs text-bd-green">
                        {t("bookings.coupon")}: {b.couponCode}
                      </p>
                    )}
                  </td>
                  <td>
                    <p className="font-medium">{b.routeName}</p>
                    <p className="text-xs text-slate-500">
                      {b.routeOrigin} → {b.routeDestination}
                    </p>
                    <p className="text-xs font-semibold text-bd-green-dark">
                      {formatMoney(b.serviceFee)}
                    </p>
                  </td>
                  <td>
                    <StatusBadge status={b.paymentStatus} />
                  </td>
                  <td>
                    <StatusBadge status={b.bookingStatus} />
                    {b.rejectionReason && (
                      <p className="mt-1 text-xs text-red-600">{b.rejectionReason}</p>
                    )}
                  </td>
                  <td className="text-xs">
                    {b.pilotName ? (
                      <>
                        <p className="font-semibold">{b.pilotName}</p>
                        <p className="text-slate-500">{b.pilotLicense}</p>
                      </>
                    ) : (
                      t("common.none")
                    )}
                  </td>
                  <td className="text-xs">{formatDate(b.createdAt)}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {(b.bookingStatus === "PENDING" ||
                        b.bookingStatus === "APPROVED") && (
                        <>
                          <button
                            className="btn-primary px-3 py-1.5 text-xs"
                            onClick={() => setAssignId(b.id)}
                          >
                            {t("bookings.approveAssign")}
                          </button>
                          {b.bookingStatus === "PENDING" && (
                            <button
                              className="btn-danger px-3 py-1.5 text-xs"
                              onClick={() => setRejectId(b.id)}
                            >
                              {t("common.reject")}
                            </button>
                          )}
                        </>
                      )}
                      {(b.bookingStatus === "ASSIGNED" ||
                        b.bookingStatus === "APPROVED") && (
                        <button
                          className="btn-secondary px-3 py-1.5 text-xs"
                          onClick={() => complete(b.id)}
                        >
                          {t("common.complete")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {assignId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md">
            <h3 className="text-lg font-bold text-bd-green-dark">
              {t("bookings.assignTitle")}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{t("bookings.assignHint")}</p>
            <select
              className="input-field mt-4"
              value={pilotId}
              onChange={(e) => setPilotId(e.target.value)}
            >
              {pilots.length === 0 && (
                <option value="">{t("bookings.noPilots")}</option>
              )}
              {pilots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.licenseNumber}
                  {p.specialization ? ` · ${p.specialization}` : ""}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setAssignId(null)}>
                {t("common.cancel")}
              </button>
              <button
                className="btn-primary"
                onClick={() => approveAndAssign(assignId)}
                disabled={!pilotId}
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md">
            <h3 className="text-lg font-bold text-bd-green-dark">
              {t("bookings.rejectTitle")}
            </h3>
            <textarea
              className="input-field mt-4 min-h-[100px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("bookings.rejectPlaceholder")}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setRejectId(null)}>
                {t("common.cancel")}
              </button>
              <button className="btn-danger" onClick={reject} disabled={!reason.trim()}>
                {t("vessels.confirmReject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
