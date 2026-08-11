import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PBCPMS | Pilot Booking & Coupon Payment Management System",
  description:
    "Pilot Booking & Coupon Payment Management System — manage vessels, routes, coupons, and pilot assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoBengali.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
