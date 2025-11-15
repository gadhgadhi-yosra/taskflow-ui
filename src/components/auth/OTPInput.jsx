import { useRef } from "react";

export function OtpInput({ value, onChange, length = 6 }) {
  const inputs = useRef([]);

  const handleChange = (v, i) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...value];
    arr[i] = v;
    onChange(arr);
    if (v && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {value.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600"
        />
      ))}
    </div>
  );
}
