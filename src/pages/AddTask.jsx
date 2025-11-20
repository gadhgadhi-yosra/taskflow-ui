import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  CalendarDays,
  Tag,
  Users,
  Flag,
  Timer,
  FileText,
} from "lucide-react";
import AppPage from "@/components/layout/AppPage";

const TASKS_STORAGE_KEY = "taskflow_tasks";

const PRIORITIES = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "critical", label: "Critique" },
];


function buildDueInfo(dueDateStr) {
  if (!dueDateStr) {
    return { label: "Sans échéance", color: "gray" };
  }

  try {
    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const target = new Date(dueDateStr + "T00:00:00");
    const diffMs = target.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0)
      return { label: "Aujourd’hui", color: "indigo" };
    if (diffDays === 1) return { label: "Demain", color: "gray" };
    if (diffDays < 0) return { label: "En retard", color: "rose" };

    const label = target.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
    return { label, color: "gray" };
  } catch {
    return { label: "Sans échéance", color: "gray" };
  }
}

function addTaskToLocalStorage(task) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(task);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Erreur écriture tasks storage :", err);
  }
}

export default function AddTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  
  const teamMock = [
    { id: 1, name: "Yosra", role: "Owner" },
    { id: 2, name: "Alex", role: "Développeur" },
  ];

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [tags, setTags] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [estimate, setEstimate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Le titre de la tâche est requis.");
      return;
    }

    setError("");
    setLoading(true);

    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const selectedMember = teamMock.find(
      (m) => String(m.id) === String(assigneeId)
    );

    const { label: dueLabel, color: dueColor } = buildDueInfo(dueDate);

    const newTask = {
      id: Date.now(),
      projectId: Number(projectId),
      title: title.trim(),
      status,
      dueLabel,
      dueColor,
      tags: tagsArray,
      priority,
      estimateHours: estimate ? Number(estimate) : null,
      description: description.trim() || "",
      assigneeId: assigneeId ? Number(assigneeId) : null,
      assigneeName: selectedMember ? selectedMember.name : null,
    };

    console.log("🧪 Nouvelle tâche (front only):", newTask);
    addTaskToLocalStorage(newTask);

    setTimeout(() => {
      setLoading(false);
      navigate(`/app/tasks?projectId=${projectId}`);
    }, 400);
  };

  return (
    <AppPage>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/70 shadow-sm px-6 py-6 md:px-8 md:py-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-indigo-100 text-xs font-semibold text-indigo-600 shadow-sm">
              <Plus className="h-4 w-4" />
              Nouvelle tâche
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Ajouter une tâche
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Projet <span className="font-semibold">#{projectId}</span> •
              définis clairement le titre, la priorité et l’échéance.
            </p>
          </div>

          <div className="hidden md:flex flex-col gap-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">
              Tips pour une bonne tâche :
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Titre clair et actionnable</li>
              <li>Échéance réaliste</li>
              <li>Tags & priorité pour la vue Kanban</li>
            </ul>
          </div>
        </div>


        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-8"
        >
 
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Informations de base
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titre de la tâche
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/40"
                placeholder="Ex : Implémenter le login, intégrer l’API..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

 
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date d’échéance
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    className="flex-1 border-none outline-none text-sm bg-transparent"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Statut initial
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">À faire</option>
                  <option value="inprogress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </div>
            </div>
          </div>

  
          <div className="border-t border-dashed border-slate-200" />

         
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Priorisation
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priorité
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      priority === p.value
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Charge de travail
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimation (heures)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                <Timer className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="flex-1 border-none outline-none text-sm bg-transparent"
                  placeholder="Ex : 3.5"
                  value={estimate}
                  onChange={(e) => setEstimate(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Cette info servira plus tard pour les stats de charge et burn-down.
              </p>
            </div>
          </div>

      
          <div className="border-t border-dashed border-slate-200" />

        
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Organisation
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                <Tag className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  className="flex-1 border-none outline-none text-sm bg-transparent"
                  placeholder="UI, Urgent, Backend..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Exemple : <span className="font-medium">UI, Urgent</span> ou{" "}
                <span className="font-medium">Backend, API</span>.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Responsable
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigner à
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
                <Users className="h-4 w-4 text-slate-400" />
                <select
                  className="flex-1 border-none outline-none text-sm bg-transparent"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  <option value="">Non assignée</option>
                  {teamMock.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} – {m.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        
          <div className="border-t border-dashed border-slate-200" />

          
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Détails
            </p>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description / notes
            </label>
            <div className="flex items-start gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/40">
              <FileText className="h-4 w-4 text-slate-400 mt-1" />
              <textarea
                rows={3}
                className="flex-1 border-none outline-none text-sm resize-none bg-transparent"
                placeholder="Détails, liens, critères d’acceptation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

  
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">
              Cette tâche apparaîtra dans la colonne Kanban du projet{" "}
              <span className="font-semibold">#{projectId}</span>.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/app/tasks?projectId=${projectId}`)
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
                <Plus className="h-4 w-4" />
                Créer la tâche
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppPage>
  );
}
