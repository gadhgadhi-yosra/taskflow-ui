
import { AlertCircle, CheckCircle } from "lucide-react";

export function FormAlert({ type = "error", children }) {
  const isError = type === "error";

  const base =
    "p-3 rounded-2xl text-sm flex items-center gap-2 border animate-in slide-in-from-top duration-300";

  const classes = isError
    ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
    : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400";

  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div className={`${base} ${classes}`}>
      <Icon size={16} />
      {children}
    </div>
  );
}
