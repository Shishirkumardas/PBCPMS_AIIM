"use client";

import { useCallback, useEffect, useState } from "react";
import { api, formatDate } from "@/lib/api";
import type { Vessel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function AdminVesselsPage() {
  const { t } = useI18n();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api
      .allVessels(filter || undefined)
      .then(setVessels)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(id: number) {
    try {
      await api.reviewVessel(id, "APPROVED");
      setSuccess(t("vessels.approved"));
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  async function reject() {
    if (!rejectId) return;
    try {
      await api.reviewVessel(rejectId, "REJECTED", reason);
      setSuccess(t("vessels.rejected"));
      setRejectId(null);
      setReason("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t("vessels.admin.title")}</h1>
          <p className="page-subtitle">{t("vessels.admin.subtitle")}</p>
        </div>
        <select
          className="input-field w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{t("vessels.allStatuses")}</option>
          <option value="PENDING">{t("vessels.pending")}</option>
          <option value="APPROVED">{t("vessels.approvedStatus")}</option>
          <option value="REJECTED">{t("vessels.rejectedStatus")}</option>
        </select>
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
                <th>{t("common.vessel")}</th>
                <th>{t("common.owner")}</th>
                <th>{t("common.type")}</th>
                <th>{t("vessels.registration")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.submitted")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {vessels.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {t("vessels.noVessels")}
                  </td>
                </tr>
              )}
              {vessels.map((v) => (
                <tr key={v.id}>
                  <td>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.description || t("common.none")}</p>
                  </td>
                  <td>
                    <p>{v.ownerName}</p>
                    <p className="text-xs text-slate-500">{v.ownerEmail}</p>
                  </td>
                  <td>{v.type}</td>
                  <td className="font-mono text-xs">{v.registrationNumber}</td>
                  <td>
                    <StatusBadge status={v.status} />
                    {v.rejectionReason && (
                      <p className="mt-1 text-xs text-red-600">{v.rejectionReason}</p>
                    )}
                  </td>
                  <td className="text-xs">{formatDate(v.createdAt)}</td>
                  <td>
                    {v.status === "PENDING" ? (
                      <div className="flex flex-wrap gap-2">
                        <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => approve(v.id)}>
                          {t("common.approve")}
                        </button>
                        <button
                          className="btn-danger px-3 py-1.5 text-xs"
                          onClick={() => setRejectId(v.id)}
                        >
                          {t("common.reject")}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">{t("common.reviewed")}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md">
            <h3 className="text-lg font-bold text-bd-green-dark">{t("vessels.rejectTitle")}</h3>
            <p className="mt-1 text-sm text-slate-500">{t("vessels.rejectHint")}</p>
            <textarea
              className="input-field mt-4 min-h-[100px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
