"use client";

export default function Alert({
  type = "error",
  message,
  onClose,
}: {
  type?: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
}) {
  if (!message) return null;

  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="font-semibold opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
