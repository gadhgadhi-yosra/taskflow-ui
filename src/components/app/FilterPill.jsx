// src/components/app/FilterPill.jsx
export default function FilterPill({
  icon: Icon,
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-4 py-2.5
        rounded-full
        bg-white
        border border-slate-200
        shadow-[0_10px_24px_rgba(15,23,42,0.04)]
        text-sm text-slate-700
        ${className}
      `}
    >
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      <select
        value={value}
        onChange={onChange}
        className="
          bg-transparent outline-none border-none
          text-sm text-slate-800
          pr-1
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
