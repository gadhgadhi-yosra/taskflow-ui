
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

const PRIORITIES = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "critical", label: "Critique" },
];

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

    console.log("🧪 Nouvelle tâche (front only):", {
      projectId,
      title: title.trim(),
      dueDate,
      status,
      tags: tagsArray,
      priority,
      estimateHours: estimate ? Number(estimate) : null,
      description: description.trim() || null,
      assigneeId: assigneeId ? Number(assigneeId) : null,
      assigneeName: selectedMember ? selectedMember.name : null,
    });

    setTimeout(() => {
      setLoading(false);
      navigate(`/app/tasks?projectId=${projectId}`);
    }, 600);
  };

  return (
    <AppPage>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">
            Ajouter une tâche
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Projet #{projectId}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 space-y-6"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre de la tâche
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
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
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">À faire</option>
                <option value="inprogress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-4">
            <div>
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
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimation (heures)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Timer className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="flex-1 border-none outline-none text-sm"
                  placeholder="Ex : 3.5"
                  value={estimate}
                  onChange={(e) => setEstimate(e.target.value)}
                />
              </div>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <Tag className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                className="flex-1 border-none outline-none text-sm"
                placeholder="UI, Urgent, Backend..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assigner à
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
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


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description / notes
            </label>
            <div className="flex items-start gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <FileText className="h-4 w-4 text-slate-400 mt-1" />
              <textarea
                rows={3}
                className="flex-1 border-none outline-none text-sm resize-none"
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

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/app/tasks?projectId=${projectId}`)}
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
        </form>
      </div>
    </AppPage>
  );
}
