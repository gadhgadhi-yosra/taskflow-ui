import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Moon, Bell, Brain, Mail, User, Lock, ChevronRight,
  Sparkles, Zap, CheckCircle2
} from "lucide-react";

/* ========================
   Storage & Theme Helpers
======================== */
const STORAGE_KEY = "taskflow:settings:fine";
const THEME_KEY = "taskflow:theme";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyDarkMode = (enabled) => {
  const html = document.documentElement;
  if (enabled) {
    html.classList.add("dark");
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem(THEME_KEY, "light");
  }
};

/* ========================
   Custom Switch (a11y)
======================== */
const Switch = ({ checked, onCheckedChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onCheckedChange(!checked)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCheckedChange(!checked);
      }
    }}
    className={`h-8 w-14 rounded-full px-1 flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60
      ${checked
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
        : "bg-gray-300 dark:bg-gray-700"
      }`}
  >
    <span
      className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300
        ${checked ? "translate-x-6" : "translate-x-0"}`}
    />
  </button>
);

/* ========================
   Page
======================== */
export default function Settings() {
  // Default state (clean & minimal)
  const defaults = useMemo(
    () => ({
      darkMode: getSystemTheme() === "dark",
      notifications: true,
      aiEnabled: true,
      dailyEmail: false,
      proUntil: "14 Déc 2025",
    }),
    []
  );

  const [state, setState] = useState(defaults);
  const [saved, setSaved] = useState(false);
  const [loadedSnapshot, setLoadedSnapshot] = useState(JSON.stringify(defaults));

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, ...parsed }));
        setLoadedSnapshot(JSON.stringify({ ...defaults, ...parsed }));
      } else {
        setLoadedSnapshot(JSON.stringify(defaults));
      }
    } catch {/* ignore */}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply dark mode on change
  useEffect(() => {
    applyDarkMode(state.darkMode);
  }, [state.darkMode]);

  const isDirty = useMemo(() => {
    return JSON.stringify(state) !== loadedSnapshot;
  }, [state, loadedSnapshot]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setLoadedSnapshot(JSON.stringify(state));
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const Row = ({ icon, iconBg, title, desc, control }) => (
    <div className="flex items-center justify-between p-5 md:p-6 rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/5">
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] md:text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          {desc && <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>}
        </div>
      </div>
      {control}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,rgba(99,102,241,0.06),transparent_60%),radial-gradient(800px_600px_at_90%_10%,rgba(168,85,247,0.06),transparent_60%)] dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 grid place-items-center text-white shadow-lg">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Paramètres
              </h1>
            </div>
          </div>

          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Sauvegardé</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Preferences - glassy card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gray-200/60 dark:border-white/10 shadow-sm
                         bg-white/70 dark:bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-xl"
            >
              <div className="px-6 md:px-8 py-6 border-b border-gray-200/70 dark:border-white/10">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Préférences
                </h2>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <Row
                  icon={<Moon className="h-5 w-5 text-purple-700 dark:text-purple-300" />}
                  iconBg="bg-purple-100 dark:bg-purple-900/40"
                  title="Mode sombre"
                  desc="Réduit la fatigue visuelle."
                  control={
                    <Switch
                      checked={state.darkMode}
                      onCheckedChange={(v) => setState((s) => ({ ...s, darkMode: v }))}
                      label="Activer le mode sombre"
                    />
                  }
                />

                <Row
                  icon={<Bell className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />}
                  iconBg="bg-yellow-100 dark:bg-yellow-900/40"
                  title="Notifications"
                  desc="Push + email pour les tâches urgentes."
                  control={
                    <Switch
                      checked={state.notifications}
                      onCheckedChange={(v) => setState((s) => ({ ...s, notifications: v }))}
                      label="Activer les notifications"
                    />
                  }
                />

                <Row
                  icon={<Brain className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />}
                  iconBg="bg-indigo-100 dark:bg-indigo-900/40"
                  title={
                    <span className="inline-flex items-center gap-2">
                      IA TaskFlow
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                        PRO
                      </span>
                    </span>
                  }
                  desc="Suggestions, résumé auto, priorisation."
                  control={
                    <Switch
                      checked={state.aiEnabled}
                      onCheckedChange={(v) => setState((s) => ({ ...s, aiEnabled: v }))}
                      label="Activer l’IA"
                    />
                  }
                />

                <Row
                  icon={<Mail className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
                  iconBg="bg-emerald-100 dark:bg-emerald-900/40"
                  title="Résumé quotidien"
                  desc="Un rapport chaque matin à 8h."
                  control={
                    <Switch
                      checked={state.dailyEmail}
                      onCheckedChange={(v) => setState((s) => ({ ...s, dailyEmail: v }))}
                      label="Activer le résumé quotidien"
                    />
                  }
                />
              </div>
            </motion.section>

            {/* Security - minimal & clean */}
            <section className="rounded-3xl border border-gray-200/60 dark:border-white/10 shadow-sm
                                bg-white/70 dark:bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-xl">
              <div className="px-6 md:px-8 py-6 border-b border-gray-200/70 dark:border-white/10">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Sécurité</h2>
              </div>

              <div className="p-4 md:p-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition
                             hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40">
                      <User className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">Profil personnel</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Modifier nom, photo, bio</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition
                             hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/40">
                      <Lock className="h-5 w-5 text-rose-700 dark:text-rose-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">Mot de passe</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Changer ton mot de passe</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </section>
          </div>

          {/* Right column - Pro card */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl p-8 text-white shadow-lg
                         bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">TaskFlow Pro</h3>
                <Sparkles className="h-8 w-8 opacity-90" />
              </div>
              <p className="text-base md:text-lg mb-6">
                Valable jusqu’au <strong>{state.proUntil}</strong>
              </p>
              <div className="space-y-4 text-[15px] md:text-base">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-300" /> IA illimitée
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" /> 50 membres max
                </div>
              </div>
              <button
                type="button"
                className="mt-8 w-full py-3.5 rounded-2xl font-semibold
                           bg-white/15 hover:bg-white/25 backdrop-blur-md transition"
              >
                Gérer l’abonnement
              </button>
            </motion.div>
          </div>
        </div>

        {/* Sticky Save */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-8 md:px-12 py-4 rounded-full font-black text-white text-lg md:text-xl transition-all
              ${isDirty
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              }`}
          >
            Sauvegarder les modifications
          </button>
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          Version interface: Fine 2026 • Tailwind + Framer Motion • Compact & accessible
        </div>
      </div>
    </div>
  );
}
