import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { FormAlert } from "@/components/auth/FormAlert";
import { AuthButton } from "@/components/auth/AuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailValid || !passwordValid) {
      setError("Veuillez remplir tous les champs correctement");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    }, 1200);
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    }, 1200);
  };

  return (
    <AuthLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
   
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Connexion
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accédez à votre espace
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
                <CheckCircle
                  size={18}
                  className="text-emerald-500 animate-in fade-in zoom-in duration-300"
                />
              ) : (
                <AlertCircle
                  size={18}
                  className="text-rose-500 animate-in fade-in zoom-in duration-300"
                />
              ))
            }
          />

    
          <PasswordField
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            extraRightSlot={
              password &&
              (passwordValid ? (
                <CheckCircle
                  size={18}
                  className="text-emerald-500 animate-in fade-in zoom-in duration-300"
                />
              ) : (
                <AlertCircle
                  size={18}
                  className="text-rose-500 animate-in fade-in zoom-in duration-300"
                />
              ))
            }
          />


          <div className="flex justify-between text-sm mt-1">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-600 dark:text-slate-400">
                Se souvenir
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
            >
              Oublié ?
            </Link>
          </div>


          {error && <FormAlert>{error}</FormAlert>}

      
          <AuthButton
            type="submit"
            variant="primary"
            disabled={loading || !emailValid || !passwordValid}
          >
            {loading && <span className="animate-spin">⏳</span>}
            <span>Se connecter</span>
          </AuthButton>
        </form>

   
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-4 text-sm text-slate-500 dark:text-slate-400">ou</span>
            </div>
        </div>

  
        <SocialButtons onClick={handleSocial} loading={loading} />


        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
          Pas de compte ?{" "}
          <Link
            to="/Signup"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
