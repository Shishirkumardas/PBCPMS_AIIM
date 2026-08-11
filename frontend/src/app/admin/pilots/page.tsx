"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, formatDate } from "@/lib/api";
import type { Pilot } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

const empty = {
  name: "",
  licenseNumber: "",
  phone: "",
  email: "",
  specialization: "",
};

export default function AdminPilotsPage() {
  const { t } = useI18n();
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    try {
      setPilots(await api.allPilots());
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
      if (editId) {
        const existing = pilots.find((p) => p.id === editId);
        await api.updatePilot(editId, {
          ...form,
          available: existing?.available ?? true,
          active: existing?.active ?? true,
        });
        setSuccess(t("pilots.updated"));
      } else {
        await api.createPilot({ ...form, available: true, active: true });
        setSuccess(t("pilots.created"));
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.failed"));
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("pilots.title")}</h1>
        <p className="page-subtitle">{t("pilots.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card">
          <h2 className="text-lg font-bold text-bd-green-dark">
            {editId ? t("pilots.edit") : t("pilots.add")}
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label-field">{t("common.name")}</label>
              <input className="input-field" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("pilots.license")}</label>
              <input className="input-field" required value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("common.phone")}</label>
              <input className="input-field" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("common.email")}</label>
              <input className="input-field" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-field">{t("pilots.specialization")}</label>
              <input className="input-field" value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
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
                    <th>{t("pilots.pilot")}</th>
                    <th>{t("pilots.licenseShort")}</th>
                    <th>{t("common.contact")}</th>
                    <th>{t("common.availability")}</th>
                    <th>{t("common.created")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pilots.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.specialization || t("common.none")}</p>
                      </td>
                      <td className="font-mono text-xs">{p.licenseNumber}</td>
                      <td>
                        <p className="text-xs">{p.phone || t("common.none")}</p>
                        <p className="text-xs text-slate-500">{p.email || t("common.none")}</p>
                      </td>
                      <td>
                        <StatusBadge status={p.available ? "ACTIVE" : "USED"} />
                        <p className="mt-1 text-[10px] text-slate-500">
                          {p.active ? t("pilots.activeAccount") : t("pilots.inactiveAccount")}
                        </p>
                      </td>
                      <td className="text-xs">{formatDate(p.createdAt)}</td>
                      <td>
                        <button
                          className="btn-secondary px-3 py-1.5 text-xs"
                          onClick={() => {
                            setEditId(p.id);
                            setForm({
                              name: p.name,
                              licenseNumber: p.licenseNumber,
                              phone: p.phone || "",
                              email: p.email || "",
                              specialization: p.specialization || "",
                            });
                          }}
                        >
                          {t("common.edit")}
                        </button>
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
