import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/auth/TextField";
import { FormAlert } from "@/components/auth/FormAlert";
import { AuthButton } from "@/components/auth/AuthButton";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailValid) {
      setError("Email invalide");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/verify-otp"), 1500);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recevez un code de réinitialisation
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@entreprise.com"
            autoComplete="email"
            icon={Mail}
            rightSlot={
              email &&
              (emailValid ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : (
                <AlertCircle size={18} className="text-rose-500" />
              ))
            }
          />

          {error && <FormAlert>{error}</FormAlert>}
          {success && (
            <FormAlert type="success">
              Code envoyé ! Redirection…
            </FormAlert>
          )}

          <AuthButton
            type="submit"
            variant="primary"
            disabled={loading || !emailValid}
          >
            {loading && <span className="animate-spin">⏳</span>}
            <span>Envoyer le code</span>
          </AuthButton>
        </form>


        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          <Link
            to="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
