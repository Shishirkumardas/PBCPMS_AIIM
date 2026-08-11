"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatCard from "@/components/StatCard";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">{t("admin.dash.title")}</h1>
        <p className="page-subtitle">{t("admin.dash.subtitle")}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t("admin.dash.owners")} value={stats.totalOwners ?? 0} accent="green" />
          <StatCard
            title={t("admin.dash.pendingVessels")}
            value={stats.pendingVessels}
            hint={`${stats.approvedVessels} ${t("admin.dash.approved")}`}
            accent="gold"
          />
          <StatCard
            title={t("admin.dash.activeRoutes")}
            value={stats.activeRoutes ?? 0}
            hint={`${stats.totalRoutes ?? 0} ${t("admin.dash.total")}`}
            accent="sky"
          />
          <StatCard
            title={t("admin.dash.availablePilots")}
            value={stats.availablePilots ?? 0}
            hint={`${stats.totalPilots ?? 0} ${t("admin.dash.total")}`}
            accent="green"
          />
          <StatCard
            title={t("admin.dash.activeCoupons")}
            value={stats.activeCoupons}
            hint={`${stats.usedCoupons} ${t("admin.dash.used")}`}
            accent="gold"
          />
          <StatCard
            title={t("admin.dash.pendingBookings")}
            value={stats.pendingBookings}
            accent="red"
          />
          <StatCard
            title={t("admin.dash.assignedBookings")}
            value={stats.assignedBookings}
            accent="sky"
          />
          <StatCard
            title={t("admin.dash.completed")}
            value={stats.completedBookings}
            hint={`${stats.paidBookings} ${t("admin.dash.paid")}`}
            accent="green"
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-bold text-bd-green-dark">{t("admin.dash.flow")}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>{t("admin.dash.flow1")}</li>
            <li>{t("admin.dash.flow2")}</li>
            <li>{t("admin.dash.flow3")}</li>
            <li>{t("admin.dash.flow4")}</li>
            <li>{t("admin.dash.flow5")}</li>
            <li>{t("admin.dash.flow6")}</li>
            <li>{t("admin.dash.flow7")}</li>
          </ol>
        </div>
        <div className="card bg-gradient-to-br from-bd-green to-bd-green-dark text-white">
          <h2 className="text-lg font-bold">{t("admin.dash.guide")}</h2>
          <p className="mt-3 text-sm text-white/90">{t("admin.dash.guideText")}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-lg bg-white/15 p-3">
              <p className="text-2xl font-bold">{stats?.totalBookings ?? 0}</p>
              <p className="text-white/80">{t("admin.dash.totalBookings")}</p>
            </div>
            <div className="rounded-lg bg-white/15 p-3">
              <p className="text-2xl font-bold">{stats?.totalCoupons ?? 0}</p>
              <p className="text-white/80">{t("admin.dash.totalCoupons")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
