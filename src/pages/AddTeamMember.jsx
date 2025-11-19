
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, Mail, Shield, Activity } from "lucide-react";
import AppPage from "@/components/layout/AppPage";

export default function AddTeamMember() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("Développeur");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("online");
  const [joined, setJoined] = useState("2025");
  const [projects, setProjects] = useState(1);
  const [activity, setActivity] = useState(80);
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Nom et email sont requis.");
      return;
    }

    setError("");
    setLoading(true);

    console.log("🧪 Nouveau membre (front only):", {
      projectId,
      name,
      role,
      email,
      status,
      joined,
      projects,
      activity,
      isOwner,
    });

    setTimeout(() => {
      setLoading(false);
      navigate(`/app/team?projectId=${projectId}`);
    }, 600);
  };

  return (
    <AppPage>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Ajouter un membre à l’équipe
          </h1>
          <p className="text-sm text-slate-500 mt-2">Projet #{projectId}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <UserPlus className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                className="flex-1 border-none outline-none text-sm"
                placeholder="Ex : Alex Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                className="flex-1 border-none outline-none text-sm"
                placeholder="email@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rôle
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Statut
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="online">online</option>
                <option value="away">away</option>
                <option value="offline">offline</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Depuis
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Ex : Jan 2025"
                value={joined}
                onChange={(e) => setJoined(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nb. projets
              </label>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                value={projects}
                onChange={(e) =>
                  setProjects(parseInt(e.target.value || "0", 10))
                }
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Activité (%)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Activity className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  className="flex-1 border-none outline-none text-sm"
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

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isOwner}
              onChange={(e) => setIsOwner(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Marquer comme Owner</span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/app/team?projectId=${projectId}`)}
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
        </form>
      </div>
    </AppPage>
  );
}
