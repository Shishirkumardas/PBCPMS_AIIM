"use client";

import DashboardShell from "@/components/DashboardShell";

const NAV = [
  { href: "/admin", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/admin/vessels", labelKey: "nav.vessels", icon: "🚢" },
  { href: "/admin/routes", labelKey: "nav.routes", icon: "🗺️" },
  { href: "/admin/pilots", labelKey: "nav.pilots", icon: "👨‍✈️" },
  { href: "/admin/coupons", labelKey: "nav.coupons", icon: "🎫" },
  { href: "/admin/bookings", labelKey: "nav.bookings", icon: "📋" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="ADMIN" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
