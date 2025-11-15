import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import { PrimaryPillButton } from "@/components/app/ActionButtons";

const initialProjects = [
  {
    id: 1,
    name: "TaskFlow App",
    progress: 88,
    lastActivity: "il y a 1 min",
    members: 5,
    color: "indigo",
    favorite: true,
    archived: false,
  },
  {
    id: 2,
    name: "Dashboard Analytics",
    progress: 97,
    lastActivity: "il y a 1 min",
    members: 4,
    color: "violet",
    favorite: false,
    archived: false,
  },
  {
    id: 3,
    name: "E-commerce 2025",
    progress: 72,
    lastActivity: "il y a 1h",
    members: 3,
    color: "emerald",
    favorite: true,
    archived: false,
  },
  {
    id: 4,
    name: "Mobile Redesign",
    progress: 54,
    lastActivity: "il y a 1j",
    members: 7,
    color: "rose",
    favorite: false,
    archived: false,
    deadlineSoon: true,
  },
  {
    id: 5,
    name: "AI Assistant Pro",
    progress: 41,
    lastActivity: "il y a 3j",
    members: 2,
    color: "amber",
    favorite: false,
    archived: true,
  },
  {
    id: 6,
    name: "SaaS Landing",
    progress: 100,
    lastActivity: "ancien",
    members: 6,
    color: "cyan",
    favorite: true,
    archived: false,
  },
];

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

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");

  const total = projects.length;
  const completed = projects.filter((p) => p.progress === 100).length;
  const favorites = projects.filter((p) => p.favorite).length;
  const archived = projects.filter((p) => p.archived).length;

  const filteredProjects = projects
    .filter((p) => {
      if (filter === "favorites") return p.favorite;
      if (filter === "completed") return p.progress === 100;
      if (filter === "archived") return p.archived;
      if (filter === "active") return !p.archived;
      return true;
    })
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

  const toggleFavorite = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Tous les projets
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                {total} projets • {completed} terminé
                {completed > 1 ? "s" : ""} • {favorites} favoris •{" "}
                {archived} archivé{archived > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setView(view === "grid" ? "list" : "grid")
                }
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
              >
                {view === "grid" ? (
                  <LayoutList className="h-5 w-5 text-slate-600" />
                ) : (
                  <LayoutGrid className="h-5 w-5 text-slate-600" />
                )}
              </button>


              <PrimaryPillButton icon={Plus}>
                Nouveau projet
              </PrimaryPillButton>
            </div>
          </div>
        </div>


        <div className="mb-12 flex flex-wrap items-center gap-3">
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
        </div>

 
        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          } gap-8`}
        >
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: view === "grid" ? -6 : 0 }}
            >
              <Link to={`/projects/${project.id}`} className="block">
                <div
                  className={`bg-white rounded-3xl p-6 shadow-sm border ${
                    project.archived
                      ? "border-slate-200 opacity-70"
                      : "border-slate-100"
                  } hover:shadow-lg transition-all duration-300 group relative cursor-pointer`}
                >
  
                  <div
                    className={`h-1 rounded-t-3xl mb-5 ${
                      colorMap[project.color]
                    }`}
                  />

             
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(project.id);
                    }}
                    className="absolute top-5 right-5 z-10"
                  >
                    <Star
                      className={`h-5 w-5 transition-all ${
                        project.favorite
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-400 hover:text-amber-500"
                      }`}
                    />
                  </button>

 
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 pr-10">
                    {project.name}
                    {project.archived && (
                      <span className="ml-2 text-sm text-slate-500 font-normal">
                        (archivé)
                      </span>
                    )}
                  </h3>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-600">
                        Avancement
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          colorMap[project.color]
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
                    <Clock className="h-4 w-4" />
                    {project.lastActivity}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-slate-500" />
                      <span className="font-medium text-slate-800">
                        {project.members} membres
                      </span>
                    </div>

                    {project.deadlineSoon && (
                      <span className="text-xs font-semibold text-red-600">
                        Bientôt
                      </span>
                    )}
                    {project.progress === 100 && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


        {filteredProjects.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              {filter === "archived" ? (
                <Archive className="h-10 w-10 text-slate-400" />
              ) : (
                <Search className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <p className="text-xl font-medium text-slate-700">
              {filter === "archived"
                ? "Aucun projet archivé"
                : "Aucun projet trouvé"}
            </p>
          </div>
        )}
      </div>
    </AppPage>
  );
}
