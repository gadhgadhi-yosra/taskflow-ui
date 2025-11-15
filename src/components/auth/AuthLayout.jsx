import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function AuthLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      const isDark =
        saved === "true" ||
        (!saved &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
    } catch {
      setDarkMode(false);
    }
  }, []);


  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode ? "true" : "false");
    } catch {

    }
  }, [darkMode]);

  return (
    <div className="auth-bg flex items-center justify-center p-4 min-h-screen">
  
      <button
        type="button"
        onClick={() => setDarkMode((v) => !v)}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-md"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

   
      <div className="w-full max-w-md">
        <div className="auth-card dark:bg-slate-900/95 dark:border-slate-700">
          {children}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          TaskFlow © 2025
        </p>
      </div>
    </div>
  );
}


export default AuthLayout;
