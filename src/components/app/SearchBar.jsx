// src/components/app/SearchBar.jsx
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  wrapperClassName = "",
}) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-4
          bg-white
          rounded-full
          border border-slate-200
          shadow-[0_18px_40px_rgba(15,23,42,0.05)]
          text-[15px] text-slate-800
          placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          transition-all
        "
      />
    </div>
  );
}
