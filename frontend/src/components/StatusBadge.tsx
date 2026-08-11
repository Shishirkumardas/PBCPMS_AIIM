"use client";

import { useI18n } from "@/lib/i18n";

const STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
  ASSIGNED: "bg-sky-50 text-sky-800 ring-sky-200",
  COMPLETED: "bg-bd-green-light text-bd-green-dark ring-bd-green/30",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  USED: "bg-slate-100 text-slate-600 ring-slate-200",
  EXPIRED: "bg-red-50 text-red-700 ring-red-200",
  PAID: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
};

const BN_LABELS: Record<string, string> = {
  PENDING: "অপেক্ষমাণ",
  APPROVED: "অনুমোদিত",
  REJECTED: "প্রত্যাখ্যাত",
  ASSIGNED: "নিযুক্ত",
  COMPLETED: "সম্পন্ন",
  CANCELLED: "বাতিল",
  ACTIVE: "সক্রিয়",
  USED: "ব্যবহৃত",
  EXPIRED: "মেয়াদোত্তীর্ণ",
  PAID: "পরিশোধিত",
  FAILED: "ব্যর্থ",
};

export default function StatusBadge({ status }: { status: string }) {
  const { isBn } = useI18n();
  const style = STYLES[status] || "bg-slate-100 text-slate-700 ring-slate-200";
  const label = isBn ? BN_LABELS[status] || status : status;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
}
