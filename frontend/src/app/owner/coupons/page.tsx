"use client";

import { useEffect, useState } from "react";
import { api, formatDate, formatMoney } from "@/lib/api";
import type { Coupon } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function OwnerCouponsPage() {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .myCoupons()
      .then(setCoupons)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("coupons.owner.title")}</h1>
        <p className="page-subtitle">{t("coupons.owner.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("common.code")}</th>
                <th>{t("common.amount")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.expires")}</th>
                <th>{t("common.issued")}</th>
                <th>{t("common.used")}</th>
                <th>{t("common.notes")}</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {t("coupons.none")}
                  </td>
                </tr>
              )}
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono font-semibold text-bd-green-dark">
                    {c.code}
                  </td>
                  <td className="font-semibold">{formatMoney(c.amount)}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="text-xs">{formatDate(c.expiresAt)}</td>
                  <td className="text-xs">{formatDate(c.issuedAt)}</td>
                  <td className="text-xs">{formatDate(c.usedAt)}</td>
                  <td className="text-xs text-slate-500">{c.notes || t("common.none")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
