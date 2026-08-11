"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, formatMoney, formatDate } from "@/lib/api";
import type { Route } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

const empty = {
  name: "",
  origin: "",
  destination: "",
  description: "",
  pilotServices: "",
  serviceFee: "",
};

export default function AdminRoutesPage() {
  const { t } = useI18n();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    try {
      setRoutes(await api.allRoutes());
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
    setError("");
    try {
      const payload = {
        name: form.name,
        origin: form.origin,
        destination: form.destination,
        description: form.description || undefined,
        pilotServices: form.pilotServices || undefined,
        serviceFee: Number(form.serviceFee),
        active: true,
      };
      if (editId) {
        await api.updateRoute(editId, payload);
        setSuccess(t("routes.updated"));
      } else {
        await api.createRoute(payload);
        setSuccess(t("routes.created"));
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  function startEdit(r: Route) {
    setEditId(r.id);
    setForm({
      name: r.name,
      origin: r.origin,
      destination: r.destination,
      description: r.description || "",
      pilotServices: r.pilotServices || "",
      serviceFee: String(r.serviceFee),
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("routes.admin.title")}</h1>
        <p className="page-subtitle">{t("routes.admin.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card lg:col-span-1">
          <h2 className="text-lg font-bold text-bd-green-dark">
            {editId ? t("routes.edit") : t("routes.add")}
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label-field">{t("routes.name")}</label>
              <input className="input-field" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("routes.origin")}</label>
              <input className="input-field" required value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("routes.destination")}</label>
              <input className="input-field" required value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("routes.fee")}</label>
              <input className="input-field" type="number" min="1" step="0.01" required
                value={form.serviceFee}
                onChange={(e) => setForm({ ...form, serviceFee: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("routes.desc")}</label>
              <textarea className="input-field min-h-[80px]" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("routes.pilotServices")}</label>
              <textarea
                className="input-field min-h-[80px]"
                value={form.pilotServices}
                onChange={(e) => setForm({ ...form, pilotServices: e.target.value })}
                placeholder={t("routes.pilotServicesPlaceholder")}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" type="submit">
                {editId ? t("common.update") : t("common.create")}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}>
                  {t("common.cancel")}
                </button>
              )}
            </div>
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
                    <th>{t("routes.route")}</th>
                    <th>{t("common.path")}</th>
                    <th>{t("common.fee")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.created")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-xs text-slate-500">{r.description || t("common.none")}</p>
                        {r.pilotServices && (
                          <p className="mt-1 text-xs text-bd-green-dark">
                            <span className="font-semibold">{t("routes.pilotServices")}: </span>
                            {r.pilotServices}
                          </p>
                        )}
                      </td>
                      <td>
                        {r.origin} → {r.destination}
                      </td>
                      <td className="font-semibold text-bd-green-dark">
                        {formatMoney(r.serviceFee)}
                      </td>
                      <td>
                        <StatusBadge status={r.active ? "ACTIVE" : "EXPIRED"} />
                      </td>
                      <td className="text-xs">{formatDate(r.createdAt)}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => startEdit(r)}>
                            {t("common.edit")}
                          </button>
                          <button
                            className="btn-primary px-3 py-1.5 text-xs"
                            onClick={async () => {
                              try {
                                await api.toggleRoute(r.id);
                                load();
                              } catch (e) {
                                setError(e instanceof Error ? e.message : t("common.failed"));
                              }
                            }}
                          >
                            {r.active ? t("common.deactivate") : t("common.activate")}
                          </button>
                        </div>
                      </td>
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
