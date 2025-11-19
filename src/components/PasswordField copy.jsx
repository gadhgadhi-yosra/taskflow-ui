// import { useState } from 'react'

// export default function PasswordField({ id, label, value, onChange, placeholder, autoComplete }) {
//   const [show, setShow] = useState(false)
//   return (
//     <div className="mb-4">
//       <label htmlFor={id} className="form-label">{label}</label>
//       <div className="relative input-with-icon">
//         <span className="input-icon-left">
//           {/* lock icon */}
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//             <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/>
//             <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6"/>
//           </svg>
//         </span>
//         <input
//           id={id}
//           type={show ? 'text' : 'password'}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           autoComplete={autoComplete}
//           className="field pr-12"
//         />
//         <button
//           type="button"
//           onClick={() => setShow(s => !s)}
//           className="absolute inset-y-0 right-2 grid place-items-center px-2 text-slate-500 hover:text-slate-700"
//           aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
//           title={show ? 'Masquer' : 'Afficher'}
//         >
//           {show ? '🙈' : '👁️'}
//         </button>
//       </div>
//       <p className="hint mt-1">8+ caractères recommandés.</p>
//     </div>
//   )
// }

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import TextField from "./TextField";

export default function PasswordField({
  label = "Mot de passe",
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  rightExtra, // ex: valid/invalid icon
  invalid = false,
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
      invalid={invalid}
      icon={<Lock size={18} className="text-slate-400" />}
      right={
        <div className="flex items-center gap-2">
          {rightExtra}
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-slate-400 hover:text-indigo-600 transition"
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      }
    />
  );
}
