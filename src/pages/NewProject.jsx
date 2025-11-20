import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Palette, Star, Archive, Users, Gauge } from "lucide-react";
import AppPage from "@/components/layout/AppPage";

const STORAGE_KEY = "taskflow_projects";

const COLORS = [
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "violet", label: "Violet", class: "bg-violet-500" },
  { value: "emerald", label: "Émeraude", class: "bg-emerald-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
  { value: "amber", label: "Ambre", class: "bg-amber-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
];

function loadExistingProjects() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Erreur lecture localStorage projets:", err);
    return [];
  }
}

export default function NewProject() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("indigo");
  const [favorite, setFavorite] = useState(false);
  const [archived, setArchived] = useState(false);
  const [members, setMembers] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Le nom du projet est requis.");
      return;
    }
    if (name.trim().length < 2) {
      setError(
        "Le nom du projet doit contenir au moins 2 caractères."
      );
      return;
    }

    setError("");

    const existing = loadExistingProjects();

    const newProject = {
      id: Date.now(), 
      name: name.trim(),
      color,
      favorite,
      archived,
      progress: Number.isNaN(Number(progress))
        ? 0
        : Math.min(100, Math.max(0, Number(progress))),
      members: Number.isNaN(Number(members))
        ? 0
        : Math.max(0, Number(members)),
      lastActivity: "à l’instant",
    };

    const updated = [...existing, newProject];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log("🧪 Projet ajouté (front only):", newProject);
    } catch (err) {
      console.error("Erreur écriture localStorage projets:", err);
    }

    navigate("/app/projects");
  };

  const selectedColor = COLORS.find((c) => c.value === color) || COLORS[0];

  return (
    <AppPage>
      <div className="max-w-3xl mx-auto px-6 py-10">
 
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Nouveau projet
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Crée un projet avec le même style visuel que ton espace
            TaskFlow. (Front-only, sans backend)
          </p>
        </div>

       
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8"
        >
     
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Nom du projet
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ex : Supermarché IA, TaskFlow App..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Minimum 2 caractères</span>
              <span>{name.length}/100</span>
            </div>
          </div>


          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Couleur
            </label>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {COLORS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setColor(colorOption.value)}
                    className={`
                      relative flex items-center gap-2 h-8 px-3 rounded-full text-xs font-medium border transition-all
                      ${
                        color === colorOption.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }
                    `}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${colorOption.class}`}
                    />
                    {colorOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div
                className={`w-6 h-6 rounded-lg ${selectedColor.class} border border-slate-200`}
              />
              <div className="text-sm text-slate-600">
                <span className="font-medium">
                  Couleur sélectionnée :
                </span>{" "}
                {selectedColor.label}
              </div>
            </div>
          </div>

        
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Options
            </label>
            <div className="flex flex-wrap gap-6">
      
              <label className="inline-flex items-center gap-3 text-sm text-slate-700 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    favorite
                      ? "bg-amber-500 border-amber-500"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {favorite && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <Star
                  className={`h-4 w-4 ${
                    favorite
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-400"
                  }`}
                />
                <span
                  className={
                    favorite ? "text-amber-700 font-medium" : "text-slate-600"
                  }
                >
                  Marquer comme favori
                </span>
              </label>

          
              <label className="inline-flex items-center gap-3 text-sm text-slate-700 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={archived}
                  onChange={(e) => setArchived(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    archived
                      ? "bg-slate-600 border-slate-600"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {archived && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <Archive
                  className={`h-4 w-4 ${
                    archived ? "text-slate-600" : "text-slate-400"
                  }`}
                />
                <span
                  className={
                    archived ? "text-slate-700 font-medium" : "text-slate-600"
                  }
                >
                  Archiver dès la création
                </span>
              </label>
            </div>
          </div>

   
          <div className="grid md:grid-cols-2 gap-4">

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Progression initiale
              </label>
              <div className="rounded-2xl border border-slate-200 px-4 py-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" />
                    Avancement
                  </span>
                  <span className="font-semibold text-slate-800">
                    {progress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

         
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Nombre de membres (aperçu)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
                <Users className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  className="flex-1 border-none outline-none text-sm"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="Ex : 3"
                />
              </div>
              <p className="text-xs text-slate-400">
                Juste pour l’affichage sur la carte du projet (front-only).
              </p>
            </div>
          </div>

   
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Aperçu du projet
            </label>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div
                  className={`w-3 h-12 rounded-lg ${selectedColor.class}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {name || "Nom du projet"}
                    </h3>
                    {favorite && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Progression : {progress}%</span>
                    <span>Membres : {members || 0}</span>
                    {archived && (
                      <span className="text-slate-400">Archivé</span>
                    )}
                    <span className="text-slate-400">
                      Dernière activité : à l’instant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

         
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/app/projects")}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim().length < 2}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold shadow-lg transition-all ${
                !name.trim() || name.trim().length < 2
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Créer le projet</span>
            </button>
          </div>
        </form>
      </div>
    </AppPage>
  );
}
