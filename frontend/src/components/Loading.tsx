"use client";

import { useI18n } from "@/lib/i18n";

export default function Loading({ label }: { label?: string }) {
  const { t } = useI18n();
  const text = label ?? t("common.loading");
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-bd-green">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-bd-green-light border-t-bd-green" />
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
}
