"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, formatDate } from "@/lib/api";
import type { Vessel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

export default function OwnerVesselsPage() {
  const { t } = useI18n();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "Cargo Vessel",
    registrationNumber: "",
    description: "",
  });

  async function load() {
    setLoading(true);
    try {
      setVessels(await api.myVessels());
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
      await api.createVessel(form);
      setSuccess(t("vessels.submitted"));
      setForm({
        name: "",
        type: "Cargo Vessel",
        registrationNumber: "",
        description: "",
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("vessels.owner.title")}</h1>
        <p className="page-subtitle">{t("vessels.owner.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card">
          <h2 className="text-lg font-bold text-bd-green-dark">{t("vessels.add")}</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label-field">{t("vessels.name")}</label>
              <input
                className="input-field"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">{t("vessels.type")}</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Cargo Vessel</option>
                <option>Passenger Vessel</option>
                <option>Tanker</option>
                <option>Tug Boat</option>
                <option>Vehicle / Truck</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">{t("vessels.reg")}</label>
              <input
                className="input-field"
                required
                value={form.registrationNumber}
                onChange={(e) =>
                  setForm({ ...form, registrationNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label-field">{t("vessels.desc")}</label>
              <textarea
                className="input-field min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button className="btn-primary w-full" type="submit">
              {t("vessels.submit")}
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
                    <th>{t("common.vessel")}</th>
                    <th>{t("common.type")}</th>
                    <th>{t("vessels.registration")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.submitted")}</th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        {t("vessels.noVesselsOwner")}
                      </td>
                    </tr>
                  )}
                  {vessels.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <p className="font-semibold">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.description || t("common.none")}</p>
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
