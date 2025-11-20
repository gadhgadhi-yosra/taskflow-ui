import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Clock,
  Users,
  Star,
  CheckCircle2,
  LayoutGrid,
  LayoutList,
  Filter,
  Archive,
  Tag,
  CalendarDays,
  ArrowRight,
  Sparkles,
  MoreVertical,
  Wand2,
} from "lucide-react";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import { PrimaryPillButton } from "@/components/app/ActionButtons";


const colorMap = {
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  cyan: "bg-cyan-500",
};

const FILTERS = [
  { value: "all", label: "Tous les projets" },
  { value: "active", label: "Actifs" },
  { value: "favorites", label: "Favoris" },
  { value: "completed", label: "Terminés" },
  { value: "archived", label: "Archivés" },
];

const SORTS = [
  { value: "name_asc", label: "Nom (A→Z)" },
  { value: "name_desc", label: "Nom (Z→A)" },
  { value: "progress_desc", label: "Progression ↓" },
  { value: "progress_asc", label: "Progression ↑" },
  { value: "members_desc", label: "Membres ↓" },
  { value: "members_asc", label: "Membres ↑" },
];


const MOCK_PROJECTS = [
  {
    id: 1,
    name: "TaskFlow App",
    progress: 72,
    lastActivity: "il y a 3 min",
    members: 5,
    favorite: true,
    archived: false,
    color: "indigo",
    status: "ontrack", 
    tags: ["Web", "React", "Productivité"],
    deadline: "Déc 2025",
    description:
      "Application de gestion de tâches et projets avec IA intégrée, vue Kanban et gestion d’équipe.",
  },
  {
    id: 2,
    name: "Supermarché IA",
    progress: 40,
    lastActivity: "il y a 2 h",
    members: 4,
    favorite: false,
    archived: false,
    color: "emerald",
    status: "atrisk",
    tags: ["Mobile", "IA", "Retail"],
    deadline: "Jan 2026",
    description:
      "Comparateur de prix intelligent pour supermarché, avec chatbot IA pour conseiller les clients.",
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    progress: 100,
    lastActivity: "hier",
    members: 3,
    favorite: true,
    archived: false,
    color: "violet",
    status: "completed",
    tags: ["Analytics", "BI"],
    deadline: "Nov 2025",
    description:
      "Dashboard analytique pour suivre la performance des équipes et des projets en temps réel.",
  },
  {
    id: 4,
    name: "Landing Page 2025",
    progress: 10,
    lastActivity: "il y a 5 j",
    members: 2,
    favorite: false,
    archived: true,
    color: "rose",
    status: "paused",
    tags: ["Design", "Marketing"],
    deadline: "—",
    description:
      "Landing page moderne pour la campagne marketing 2025, orientée conversion.",
  },
];


function getStatusBadge(project) {
  if (project.progress === 100 || project.status === "completed") {
    return {
      label: "Terminé",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }
  if (project.status === "atrisk") {
    return {
      label: "À risque",
      className: "bg-red-50 text-red-700 border-red-100",
    };
  }
  if (project.status === "paused") {
    return {
      label: "En pause",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }
  return {
    label: "On track",
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
}

function generateAiSummary(project) {

  const base = `Le projet "${project.name}" est actuellement à ${project.progress}% de progression avec une équipe de ${project.members} membre(s).`;
  if (project.progress === 100) {
    return (
      base +
      " Le projet est marqué comme terminé. Les prochaines étapes possibles sont la documentation finale, la mise en production et la collecte de feedback utilisateur."
    );
  }
  if (project.status === "atrisk") {
    return (
      base +
      " L’état est considéré comme à risque. L’IA recommande de revoir le scope, clarifier les priorités et réduire le nombre de tâches critiques pour ce sprint."
    );
  }
  if (project.status === "paused") {
    return (
      base +
      " Le projet est actuellement en pause. Clarifie la vision produit et fixe une nouvelle date de reprise pour garantir un alignement de l’équipe."
    );
  }
  return (
    base +
    " Le projet est globalement sur la bonne voie. L’IA suggère de verrouiller les fonctionnalités clés et de planifier une phase de stabilisation / QA."
  );
}


function ProjectPreviewModal({ open, project, onClose }) {
  if (!open || !project) return null;

  const status = getStatusBadge(project);
  const aiSummary = generateAiSummary(project);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {project.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dernière activité : {project.lastActivity} • Deadline :{" "}
              {project.deadline}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-medium ${status.className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.label}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-[11px] border border-slate-100">
            <Users className="h-3 w-3" />
            {project.members} membre
            {project.members > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-[11px] border border-slate-100">
            <CheckCircle2 className="h-3 w-3" />
            {project.progress}% complété
          </span>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] border border-slate-100"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-1">
            Description
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {project.description || "Aucune description fournie."}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-indigo-500" />
            Résumé IA
          </p>
          <p className="text-sm text-slate-700 leading-relaxed bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3">
            {aiSummary}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-500">
            Prévisualisation projet • Front-only
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


function ProjectActionsMenu({
  project,
  onViewTasks,
  onViewTeam,
  onDuplicate,
  onToggleArchive,
  onDelete,
  onPreview,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="p-2 rounded-xl hover:bg-slate-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MoreVertical className="h-5 w-5 text-slate-500" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white shadow-xl z-20 overflow-hidden text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
              onClick={() => {
                onPreview(project);
                setOpen(false);
              }}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Aperçu & résumé IA
            </button>
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
              onClick={() => {
                onViewTasks(project);
                setOpen(false);
              }}
            >
              <ArrowRight className="h-4 w-4 text-slate-500" />
              Voir tâches
            </button>
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
              onClick={() => {
                onViewTeam(project);
                setOpen(false);
              }}
            >
              <Users className="h-4 w-4 text-slate-500" />
              Voir équipe
            </button>
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
              onClick={() => {
                onDuplicate(project);
                setOpen(false);
              }}
            >
              <Plus className="h-4 w-4 text-slate-500" />
              Dupliquer le projet
            </button>
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
              onClick={() => {
                onToggleArchive(project);
                setOpen(false);
              }}
            >
              <Archive className="h-4 w-4 text-slate-500" />
              {project.archived ? "Désarchiver" : "Archiver"}
            </button>
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              onClick={() => {
                onDelete(project);
                setOpen(false);
              }}
            >
              ✕ Supprimer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("name_asc");

  const [previewProject, setPreviewProject] = useState(null);

  const navigate = useNavigate();

  const total = projects.length;
  const completed = projects.filter((p) => p.progress === 100).length;
  const favorites = projects.filter((p) => p.favorite).length;
  const archived = projects.filter((p) => p.archived).length;

  const filtered = useMemo(
    () =>
      projects
        .filter((p) => {
          if (filter === "favorites") return p.favorite;
          if (filter === "completed") return p.progress === 100;
          if (filter === "archived") return p.archived;
          if (filter === "active") return !p.archived;
          return true;
        })
        .filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        ),
    [projects, filter, search]
  );

  const sortedProjects = useMemo(() => {
    const arr = [...filtered];
    if (sort === "name_asc") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc")
      arr.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "progress_desc") arr.sort((a, b) => b.progress - a.progress);
    else if (sort === "progress_asc") arr.sort((a, b) => a.progress - b.progress);
    else if (sort === "members_desc") arr.sort((a, b) => b.members - a.members);
    else if (sort === "members_asc") arr.sort((a, b) => a.members - b.members);
    return arr;
  }, [filtered, sort]);

  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
        );


  const toggleFavorite = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const handleViewTasks = (project) => {
    navigate(`/app/tasks?projectId=${project.id}`);
  };

  const handleViewTeam = (project) => {
    navigate(`/app/team?projectId=${project.id}`);
  };

  const handleDuplicate = (project) => {
    const newId = projects.length
      ? Math.max(...projects.map((p) => p.id)) + 1
      : 1;
    const copy = {
      ...project,
      id: newId,
      name: project.name + " (copie)",
      favorite: false,
      archived: false,
    };
    setProjects((prev) => [...prev, copy]);
  };

  const handleToggleArchive = (project) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, archived: !p.archived } : p
      )
    );
  };

  const handleDelete = (project) => {
    if (!window.confirm(`Supprimer le projet "${project.name}" ?`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const openPreview = (project) => {
    setPreviewProject(project);
  };

  const closePreview = () => {
    setPreviewProject(null);
  };

  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600 mb-3">
              <Sparkles className="h-4 w-4" />
              Vue projets
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Tous les projets
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {total} projet{total > 1 ? "s" : ""} • {completed} terminé
              {completed > 1 ? "s" : ""} • {favorites} favori
              {favorites > 1 ? "s" : ""} • {archived} archivé
              {archived > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
            >
              {view === "grid" ? (
                <LayoutList className="h-5 w-5 text-slate-600" />
              ) : (
                <LayoutGrid className="h-5 w-5 text-slate-600" />
              )}
            </button>

            <PrimaryPillButton
              icon={Plus}
              onClick={() => navigate("/app/projects/new")}
            >
              Nouveau projet
            </PrimaryPillButton>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white border border-slate-100 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Total projets</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {total}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FolderMiniIcon />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-emerald-100 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Taux de complétion</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {avgProgress}%
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-amber-100 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Favoris</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {favorites}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Archivés</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {archived}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Archive className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>

   
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            wrapperClassName="flex-1 min-w-[260px]"
          />

          <FilterPill
            icon={Filter}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={FILTERS}
          />

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            <span className="hidden sm:inline">Trier par</span>
            <select
              className="bg-transparent border-none outline-none text-xs font-medium text-slate-800"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          } gap-8`}
        >
          {sortedProjects.map((project, i) => {
            const status = getStatusBadge(project);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: view === "grid" ? -6 : 0 }}
              >
                <div
                  className={`bg-white rounded-3xl p-6 shadow-sm border ${
                    project.archived
                      ? "border-slate-200 opacity-75"
                      : "border-slate-100"
                  } hover:shadow-lg transition-all duration-300 group relative cursor-pointer`}
                  onClick={() => handleViewTasks(project)}
                >
                  <div
                    className={`h-1 rounded-t-3xl mb-5 ${
                      colorMap[project.color] || "bg-indigo-500"
                    }`}
                  />

             
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.id);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-100 transition"
                    >
                      <Star
                        className={`h-5 w-5 transition-all ${
                          project.favorite
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-400 hover:text-amber-500"
                        }`}
                      />
                    </button>

                    <ProjectActionsMenu
                      project={project}
                      onViewTasks={handleViewTasks}
                      onViewTeam={handleViewTeam}
                      onDuplicate={handleDuplicate}
                      onToggleArchive={handleToggleArchive}
                      onDelete={handleDelete}
                      onPreview={openPreview}
                    />
                  </div>

         
                  <div className="flex items-start justify-between gap-3 mb-3 pr-10">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {project.name}
                      </h3>
                      {project.archived && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          (archivé)
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-medium ${status.className}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </div>

             
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] border border-slate-100"
                        >
                          <Tag className="h-3 w-3" />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

       
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">
                        Avancement
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          colorMap[project.color] || "bg-indigo-500"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

        
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{project.lastActivity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>Deadline : {project.deadline}</span>
                    </div>
                  </div>

       
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-slate-500" />
                        <span className="font-medium text-slate-800 text-sm">
                          {project.members} membre
                          {project.members > 1 ? "s" : ""}
                        </span>
                      </div>

                      {project.progress === 100 && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTasks(project);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        Voir tâches
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTeam(project);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                      >
                        Voir équipe
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

   
        {sortedProjects.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              {filter === "archived" ? (
                <Archive className="h-10 w-10 text-slate-400" />
              ) : (
                <Search className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <p className="text-xl font-medium text-slate-800 mb-2">
              {filter === "archived"
                ? "Aucun projet archivé"
                : "Aucun projet trouvé"}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Essaie de changer les filtres ou crée un nouveau projet.
            </p>
            <PrimaryPillButton
              icon={Plus}
              onClick={() => navigate("/app/projects/new")}
            >
              Créer un projet
            </PrimaryPillButton>
          </div>
        )}
      </div>

      <AnimatePresence>
        <ProjectPreviewModal
          open={!!previewProject}
          project={previewProject}
          onClose={closePreview}
        />
      </AnimatePresence>
    </AppPage>
  );
}


function FolderMiniIcon() {
  return (
    <svg
      className="h-5 w-5 text-indigo-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7.5A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5V7Z" />
    </svg>
  );
}
