import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { OtpInput } from "@/components/auth/OtpInput";
import { FormAlert } from "@/components/auth/FormAlert";
import { AuthButton } from "@/components/auth/AuthButton";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setError("6 chiffres requis");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      }, 1500);
    }, 1000);
  };

  const canSubmit = otp.join("").length === 6 && !loading;

  return (
    <AuthLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
 
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Code de vérification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Saisissez le code à 6 chiffres
          </p>
        </div>

  
        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput value={otp} onChange={setOtp} />

          {error && <FormAlert>{error}</FormAlert>}
          {success && (
            <FormAlert type="success">
              Code validé ! Connexion…
            </FormAlert>
          )}

          <AuthButton
            type="submit"
            variant="primary"
            disabled={!canSubmit}
          >
            {loading && <span className="animate-spin">⏳</span>}
            <span>Vérifier</span>
          </AuthButton>
        </form>


        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
          <button
            type="button"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Renvoyer le code
          </button>
        </p>
        <p className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            Retour
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
