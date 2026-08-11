"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, formatMoney } from "@/lib/api";
import type { Route } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function OwnerRoutesPage() {
  const { t } = useI18n();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .activeRoutes()
      .then(setRoutes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t("routes.owner.title")}</h1>
          <p className="page-subtitle">{t("routes.owner.subtitle")}</p>
        </div>
        <Link href="/owner/bookings/new" className="btn-primary">
          {t("routes.bookRoute")}
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routes.length === 0 && (
            <div className="card text-slate-500">{t("routes.none")}</div>
          )}
          {routes.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-bd-green-dark">{r.name}</h3>
                <StatusBadge status="ACTIVE" />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {r.origin} → {r.destination}
              </p>
              <p className="mt-2 text-xs text-slate-500">{r.description || t("common.none")}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xl font-bold text-bd-green">
                  {formatMoney(r.serviceFee)}
                </p>
                <Link
                  href={`/owner/bookings/new?routeId=${r.id}`}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  {t("routes.book")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
