"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatDate, formatMoney } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function OwnerBookingsPage() {
  const { t } = useI18n();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .myBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t("bookings.owner.title")}</h1>
          <p className="page-subtitle">{t("bookings.owner.subtitle")}</p>
        </div>
        <Link href="/owner/bookings/new" className="btn-primary">
          {t("owner.dash.newBooking")}
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 && (
            <div className="card text-center text-slate-500">
              {t("bookings.owner.none")}{" "}
              <Link href="/owner/bookings/new" className="font-semibold text-bd-green">
                {t("bookings.owner.first")}
              </Link>
            </div>
          )}
          {bookings.map((b) => (
            <div key={b.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("bookings.booking")} #{b.id}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-bd-green-dark">
                    {b.routeName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {b.routeOrigin} → {b.routeDestination}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={b.paymentStatus} />
                  <StatusBadge status={b.bookingStatus} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">{t("common.vessel")}</p>
                  <p className="font-medium">{b.vesselName}</p>
                  <p className="text-xs text-slate-500">{b.vesselRegistration}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t("bookings.serviceFee")}</p>
                  <p className="font-semibold text-bd-green-dark">
                    {formatMoney(b.serviceFee)}
                  </p>
                  {b.couponCode && (
                    <p className="text-xs text-bd-green">
                      {t("bookings.paidWith")} {b.couponCode}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t("bookings.assignedPilot")}</p>
                  <p className="font-medium">{b.pilotName || t("common.notAssigned")}</p>
                  {b.pilotLicense && (
                    <p className="text-xs text-slate-500">{b.pilotLicense}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t("common.timeline")}</p>
                  <p className="text-xs">
                    {t("common.created")}: {formatDate(b.createdAt)}
                  </p>
                  {b.paidAt && (
                    <p className="text-xs">
                      {t("common.paid")}: {formatDate(b.paidAt)}
                    </p>
                  )}
                  {b.assignedAt && (
                    <p className="text-xs">
                      {t("common.assigned")}: {formatDate(b.assignedAt)}
                    </p>
                  )}
                </div>
              </div>

              {(b.rejectionReason || b.adminNotes || b.ownerNotes) && (
                <div className="mt-4 rounded-lg bg-bd-green-light/50 p-3 text-sm text-slate-700">
                  {b.ownerNotes && (
                    <p>
                      {t("common.yourNotes")}: {b.ownerNotes}
                    </p>
                  )}
                  {b.adminNotes && (
                    <p>
                      {t("common.adminNotes")}: {b.adminNotes}
                    </p>
                  )}
                  {b.rejectionReason && (
                    <p className="text-red-700">
                      {t("common.rejection")}: {b.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
