// src/components/app/ActionButtons.jsx
import { Loader2 } from "lucide-react";

export function PrimaryPillButton({ children, icon: Icon, loading, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center gap-3
        px-7 py-3.5 rounded-full
        bg-gradient-to-r from-[#5B3FFF] to-[#9B5CFF]
        text-white font-semibold text-[15px]
        shadow-[0_16px_30px_rgba(91,63,255,0.25)]
        hover:shadow-[0_18px_35px_rgba(91,63,255,0.30)]
        transition-all duration-200
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-[#5B3FFF]/30
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : Icon ? (
        <Icon className="h-5 w-5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function SecondaryPillButton({ children, icon: Icon, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center gap-3
        px-7 py-3.5 rounded-full
        bg-white text-slate-900
        font-semibold text-[15px]
        border border-slate-200
        shadow-[0_10px_24px_rgba(15,23,42,0.04)]
        hover:bg-slate-50 hover:border-slate-300
        transition-all duration-200
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-indigo-500/20
        ${className}
      `}
    >
      {Icon && <Icon className="h-5 w-5 text-slate-700" />}
      <span>{children}</span>
    </button>
  );
}
