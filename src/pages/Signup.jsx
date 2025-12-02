import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { FormAlert } from "@/components/auth/FormAlert";
import { AuthButton } from "@/components/auth/AuthButton";

// Change this if your backend runs on a different port
const API_URL = "http://localhost:3000";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setNameValid(fullName.trim().length >= 3);
  }, [fullName]);

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  useEffect(() => {
    setConfirmValid(confirm === password && confirm.length >= 6);
  }, [confirm, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
      setError("Veuillez remplir tous les champs correctement");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Sending signup request:", { name: fullName, email });

      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Échec de l'inscription");
      }

      // Store auth data returned by backend
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");

      navigate("/app", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);

      // Network error
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré (http://localhost:3000).");
      }
      // Firebase errors
      else if (err.code?.startsWith("auth/")) {
        setError(
          err.code === "auth/email-already-in-use"
            ? "Cet email est déjà utilisé"
            : err.code === "auth/weak-password"
            ? "Mot de passe trop faible"
            : err.message
        );
      }
      // Backend error
      else {
        setError(err.message || "Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => navigate("/app"), 1400);
  };

  if (!mounted) return null;

  return (
    <AuthLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Créer un compte
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accédez à votre espace de gestion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom complet"
            autoComplete="name"
            icon={User}
            rightSlot={
              fullName &&
              (nameValid ? (
                <CheckCircle size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-300" />
              ) : (
                <AlertCircle size={18} className="text-rose-500 animate-in fade-in zoom-in duration-300" />
              ))
            }
          />

          <TextField
            label="Adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@entreprise.com"
            autoComplete="email"
            icon={Mail}
            rightSlot={
              email &&
              (emailValid ? (
                <CheckCircle size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-300" />
              ) : (
                <AlertCircle size={18} className="text-rose-500 animate-in fade-in zoom-in duration-300" />
              ))
            }
          />

          <PasswordField
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
            autoComplete="new-password"
            extraRightSlot={
              password &&
              (passwordValid ? (
                <CheckCircle size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-300" />
              ) : (
                <AlertCircle size={18} className="text-rose-500 animate-in fade-in zoom-in duration-300" />
              ))
            }
          />

          <PasswordField
            label="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Répétez le mot de passe"
            autoComplete="new-password"
            extraRightSlot={
              confirm &&
              (confirmValid ? (
                <CheckCircle size={18} className="text-emerald-500 animate-in fade-in zoom-in duration-300" />
              ) : (
                <AlertCircle size={18} className="text-rose-500 animate-in fade-in zoom-in duration-300" />
              ))
            }
          />

          {error && <FormAlert>{error}</FormAlert>}

          <AuthButton
            type="submit"
            variant="primary"
            disabled={loading || !nameValid || !emailValid || !passwordValid || !confirmValid}
          >
            {loading && <span className="animate-spin">Loading...</span>}
            <span>Créer le compte</span>
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
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}