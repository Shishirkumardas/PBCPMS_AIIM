"use client";

import DashboardShell from "@/components/DashboardShell";

const NAV = [
  { href: "/owner", labelKey: "nav.dashboard", icon: "📊" },
  { href: "/owner/vessels", labelKey: "nav.myVessels", icon: "🚢" },
  { href: "/owner/routes", labelKey: "nav.routes", icon: "🗺️" },
  { href: "/owner/coupons", labelKey: "nav.myCoupons", icon: "🎫" },
  { href: "/owner/bookings", labelKey: "nav.bookings", icon: "📋" },
  { href: "/owner/bookings/new", labelKey: "nav.newBooking", icon: "➕" },
];

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="OWNER" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
