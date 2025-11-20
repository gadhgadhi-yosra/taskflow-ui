import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Shield,
  Activity,
  Users,
  Sparkles,
} from "lucide-react";
import AppPage from "@/components/layout/AppPage";

const TEAM_MEMBERS_STORAGE_KEY = "taskflow_team_members";

const initialsOf = (fullName) =>
  fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const roleConfig = {
  Owner: { gradient: "from-purple-600 to-indigo-600" },
  Admin: { gradient: "from-rose-500 to-pink-600" },
  Manager: { gradient: "from-blue-500 to-cyan-600" },
  Designer: { gradient: "from-violet-500 to-purple-600" },
  Développeur: { gradient: "from-emerald-500 to-teal-600" },
};

function addMemberToStorage(member) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(member);
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Erreur écriture membre storage :", err);
  }
}

export default function AddTeamMember() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("Développeur");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("online");
  const [joined, setJoined] = useState("Jan 2025");
  const [projects, setProjects] = useState(1);
  const [activity, setActivity] = useState(80);
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preview = useMemo(
    () => ({
      name: name || "Nom du membre",
      email: email || "email@entreprise.com",
      role,
      status,
      joined: joined || "Jan 2025",
      projects: projects || 0,
      activity: activity || 0,
      isOwner,
    }),
    [name, email, role, status, joined, projects, activity, isOwner]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Nom et email sont requis.");
      return;
    }

    setError("");
    setLoading(true);

    const newMember = {
      id: Date.now(),
      projectId: Number(projectId),
      name: name.trim(),
      role,
      email: email.trim(),
      status,
      joined: joined.trim() || "Jan 2025",
      projects: Number(projects) || 0,
      activity: Number(activity) || 0,
      isOwner,
    };

    console.log("🧪 Nouveau membre (front + localStorage):", newMember);
    addMemberToStorage(newMember);

    setTimeout(() => {
      setLoading(false);
      navigate(`/app/team?projectId=${projectId}`);
    }, 400);
  };

  const roleGradient =
    roleConfig[preview.role]?.gradient || roleConfig["Développeur"].gradient;

  return (
    <AppPage>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
  
        <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/70 shadow-sm px-6 py-6 md:px-8 md:py-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-indigo-100 text-xs font-semibold text-indigo-600 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Nouveau membre
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Ajouter un membre à l’équipe
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Équipe du projet{" "}
              <span className="font-semibold text-slate-900">
                #{projectId}
              </span>
              .
            </p>
          </div>

          <div className="hidden md:flex flex-col gap-2 text-xs text-slate-600 max-w-xs">
            <p className="font-semibold text-slate-700">
              Bon membre = bonne équipe :
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Email pro bien rempli ✅</li>
              <li>Rôle clair (Owner, Admin…)</li>
              <li>Activité estimée pour les insights</li>
            </ul>
          </div>
        </div>

      
        <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-start">
    
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-8"
          >
         
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Informations personnelles
                </p>
                <span className="text-[11px] text-slate-400">
                  Champs obligatoires marqués par *
                </span>
              </div>

      
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet *
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                  <UserPlus className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className="flex-1 border-none outline-none text-sm bg-transparent"
                    placeholder="Ex : Alex Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

      
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email professionnel *
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    className="flex-1 border-none outline-none text-sm bg-transparent"
                    placeholder="email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200" />


            <div className="grid md:grid-cols-2 gap-6">

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Rôle dans l’équipe
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rôle
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <select
                    className="flex-1 border-none outline-none text-sm bg-transparent"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Owner</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Designer</option>
                    <option>Développeur</option>
                  </select>
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 mt-2">
                  <input
                    type="checkbox"
                    checked={isOwner}
                    onChange={(e) => setIsOwner(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Marquer comme Owner principal du projet</span>
                </label>
              </div>

       
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Disponibilité
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Statut
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="online">online</option>
                  <option value="away">away</option>
                  <option value="offline">offline</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Sera utilisé plus tard pour l’indicateur de présence de
                  l’équipe.
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200" />

       
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ancienneté
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dans l’équipe depuis
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-slate-50/40"
                  placeholder="Ex : Jan 2025"
                  value={joined}
                  onChange={(e) => setJoined(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Implication
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre de projets
                </label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-slate-50/40"
                  value={projects}
                  onChange={(e) =>
                    setProjects(parseInt(e.target.value || "0", 10))
                  }
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Activité
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Activité estimée (%)
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    className="flex-1 border-none outline-none text-sm bg-transparent"
                    value={activity}
                    onChange={(e) =>
                      setActivity(
                        Math.min(
                          100,
                          Math.max(0, parseInt(e.target.value || "0", 10))
                        )
                      )
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}

    
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="h-3 w-3 text-slate-400" />
                Ce membre sera ajouté à l’équipe du projet #{projectId}.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/app/team?projectId=${projectId}`)
                  }
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
                >
                  {loading && <span className="animate-spin">⏳</span>}
                  Ajouter le membre
                </button>
              </div>
            </div>
          </form>


          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Prévisualisation carte membre
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-100">
              <div className="flex items-start gap-5 mb-6">
                <div className="relative">
                  <div className="w-18 h-18 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-600 p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-2xl font-bold text-slate-900">
                      {initialsOf(preview.name)}
                    </div>
                  </div>
                  {preview.isOwner && (
                    <span className="absolute -top-2 -right-2 text-[11px] px-2 py-1 rounded-full bg-amber-400 text-white font-semibold shadow">
                      Owner
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {preview.name}
                  </h2>
                  <p className="text-sm text-slate-500 break-all">
                    {preview.email}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${roleGradient} text-white text-xs font-bold`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {preview.role}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Statut</span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        preview.status === "online"
                          ? "bg-emerald-500"
                          : preview.status === "away"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {preview.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Depuis</span>
                  <span>{preview.joined}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Projets</span>
                  <span>{preview.projects}</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-slate-600 text-xs mb-1.5">
                    <span>Activité estimée</span>
                    <span className="font-semibold text-slate-900">
                      {preview.activity}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                      style={{ width: `${preview.activity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Cette carte est uniquement une prévisualisation côté front pour
              vérifier le rendu du membre avant validation.
            </p>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
