import { useState, memo } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { TextField } from "./TextField";

export const PasswordField = memo(function PasswordField({
  label = "Mot de passe",
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  extraRightSlot,
}) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      icon={Lock}
      rightSlot={
        <>
          {extraRightSlot && (
            <span className="mr-7 flex items-center">{extraRightSlot}</span>
          )}

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </>
      }
    />
  );
});
