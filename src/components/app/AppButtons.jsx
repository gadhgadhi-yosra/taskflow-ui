// src/components/app/AppButtons.jsx
import { Loader2 } from "lucide-react";

export function PrimaryPillButton({
  children,
  icon: Icon,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={
        "flex items-center gap-3 px-6 py-3 " +
        "bg-gradient-to-r from-indigo-600 to-purple-600 " +
        "text-white rounded-full font-medium " +
        "shadow-lg hover:shadow-xl transition-all active:scale-[0.98] " +
        className
      }
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {!loading && Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </button>
  );
}

export function SecondaryPillButton({
  children,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={
        "flex items-center gap-2 px-5 py-3 " +
        "bg-white border border-gray-300 rounded-full " +
        "font-medium hover:bg-gray-50 transition shadow-sm active:scale-[0.98] " +
        className
      }
    >
      {Icon && <Icon className="h-5 w-5 text-gray-600" />}
      <span>{children}</span>
    </button>
  );
}
