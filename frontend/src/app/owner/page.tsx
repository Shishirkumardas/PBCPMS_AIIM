"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import StatCard from "@/components/StatCard";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";

export default function OwnerDashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .ownerStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t("owner.dash.title")}</h1>
          <p className="page-subtitle">{t("owner.dash.subtitle")}</p>
        </div>
        <Link href="/owner/bookings/new" className="btn-primary">
          {t("owner.dash.newBooking")}
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t("owner.dash.myVessels")} value={stats.totalVessels} accent="green" />
          <StatCard
            title={t("owner.dash.approvedVessels")}
            value={stats.approvedVessels}
            hint={`${stats.pendingVessels} ${t("owner.dash.pending")}`}
            accent="sky"
          />
          <StatCard
            title={t("owner.dash.activeCoupons")}
            value={stats.activeCoupons}
            hint={`${stats.usedCoupons} ${t("admin.dash.used")}`}
            accent="gold"
          />
          <StatCard
            title={t("owner.dash.myBookings")}
            value={stats.totalBookings}
            hint={`${stats.assignedBookings} ${t("owner.dash.assigned")}`}
            accent="green"
          />
          <StatCard title={t("owner.dash.pendingLabel")} value={stats.pendingBookings} accent="gold" />
          <StatCard title={t("owner.dash.completed")} value={stats.completedBookings} accent="sky" />
          <StatCard title={t("owner.dash.paid")} value={stats.paidBookings} accent="green" />
          <StatCard
            title={t("owner.dash.activeRoutes")}
            value={stats.activeRoutes ?? 0}
            accent="red"
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/owner/vessels",
            title: t("owner.dash.addVessel"),
            desc: t("owner.dash.addVesselDesc"),
          },
          {
            href: "/owner/coupons",
            title: t("owner.dash.viewCoupons"),
            desc: t("owner.dash.viewCouponsDesc"),
          },
          {
            href: "/owner/bookings",
            title: t("owner.dash.trackBookings"),
            desc: t("owner.dash.trackBookingsDesc"),
          },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card transition hover:shadow-soft">
            <h3 className="font-bold text-bd-green-dark">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
