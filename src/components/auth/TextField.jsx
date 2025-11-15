import { memo } from "react";

export const TextField = memo(function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  rightSlot,
}) {
  return (
    <div className="space-y-1">
      {label && <label className="form-label">{label}</label>}

      <div className="input-with-icon">
        {Icon && (
          <span className="input-icon-left">
            <Icon size={18} />
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="field"
        />

        {rightSlot && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
});
