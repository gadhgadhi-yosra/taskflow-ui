import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  Filter,
  Users,
  FolderKanban,
  SortDesc,
} from "lucide-react";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import {
  PrimaryPillButton,
  SecondaryPillButton,
} from "@/components/app/ActionButtons";

import TaskCard from "@/components/tasks/TaskCard";
import TaskDetailsModal from "@/components/tasks/TaskDetailsModal";


const TASKS_STORAGE_KEY = "taskflow_tasks";

const MOCK_PROJECTS = [
  { id: 1, name: "TaskFlow App" },
  { id: 2, name: "Supermarché IA" },
  { id: 3, name: "Dashboard Analytics" },
];

const COLUMNS = [
  { id: "todo", title: "À faire", color: "indigo" },
  { id: "inprogress", title: "En cours", color: "orange" },
  { id: "done", title: "Terminé", color: "emerald" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "Toutes les tâches" },
  { value: "today", label: "Aujourd’hui" },
  { value: "urgent", label: "Urgent" },
  { value: "mine", label: "Assignées à moi" },
];

const MOCK_TASKS = [
  {
    id: 1,
    projectId: 1,
    title: "Configurer l’authentification (login/signup)",
    status: "todo",
    dueLabel: "Aujourd’hui",
    dueColor: "indigo",
    tags: ["Auth", "Urgent"],
    priority: "high",
    estimateHours: 3,
    assigneeName: "Toi",
    description:
      "Créer les écrans d’authentification et connecter au backend plus tard.",
  },
  {
    id: 2,
    projectId: 1,
    title: "Design du dashboard principal",
    status: "inprogress",
    dueLabel: "Demain",
    dueColor: "gray",
    tags: ["UI", "Dashboard"],
    priority: "medium",
    estimateHours: 5,
    assigneeName: "Yosra",
    description: "Mettre en place les cards de stats, courbes et section IA.",
  },
  {
    id: 3,
    projectId: 2,
    title: "Scraper les prix concurrents",
    status: "todo",
    dueLabel: "Sans échéance",
    dueColor: "gray",
    tags: ["Data", "Scraping"],
    priority: "high",
    estimateHours: 4,
    assigneeName: "Data team",
    description: "Préparer le script de scraping pour Géant, Aziza, etc.",
  },
  {
    id: 4,
    projectId: 1,
    title: "Intégrer le Kanban des tâches",
    status: "done",
    dueLabel: "Hier",
    dueColor: "gray",
    tags: ["Frontend"],
    priority: "medium",
    estimateHours: 2,
    assigneeName: "Toi",
    description: "Mettre en place drag & drop + design final.",
  },
];


function loadInitialTasks() {
  if (typeof window === "undefined") return MOCK_TASKS;

  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(MOCK_TASKS));
      return MOCK_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(MOCK_TASKS));
    return MOCK_TASKS;
  } catch (err) {
    console.error("Erreur lecture localStorage tasks :", err);
    return MOCK_TASKS;
  }
}


export default function Tasks() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState(() => loadInitialTasks());

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();


  const updateTasks = (updater) => {
    setTasks((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Erreur écriture localStorage tasks :", err);
      }
      return next;
    });
  };


  const urlParams = new URLSearchParams(location.search);
  const projectIdFromUrl = urlParams.get("projectId");

  const effectiveProjectId =
    selectedProjectId ||
    (projectIdFromUrl ? Number(projectIdFromUrl) : MOCK_PROJECTS[0]?.id);

  const currentProject = MOCK_PROJECTS.find(
    (p) => p.id === effectiveProjectId
  );

  const handleProjectChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedProjectId(value);

    const params = new URLSearchParams(location.search);
    if (value) params.set("projectId", String(value));
    else params.delete("projectId");
    navigate({ search: params.toString() }, { replace: true });
  };


  const projectTasks = tasks.filter(
    (t) => t.projectId === effectiveProjectId
  );

  const applyFilters = (list) =>
    list.filter((task) => {
      const q = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        (task.tags || []).some((t) => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filter === "today") return task.dueLabel === "Aujourd’hui";
      if (filter === "urgent")
        return (
          (task.tags || []).some((t) => t.toLowerCase() === "urgent") ||
          ["high", "critical"].includes(task.priority)
        );
      if (filter === "mine") return task.assigneeName === "Toi";

      return true;
    });

  const tasksByColumn = useMemo(() => {
    const grouped = { todo: [], inprogress: [], done: [] };
    projectTasks.forEach((t) => {
      if (t.status === "inprogress") grouped.inprogress.push(t);
      else if (t.status === "done") grouped.done.push(t);
      else grouped.todo.push(t);
    });

    return {
      todo: applyFilters(grouped.todo),
      inprogress: applyFilters(grouped.inprogress),
      done: applyFilters(grouped.done),
    };
  }, [projectTasks, search, filter]);

  const getTaskCount = (colId) => tasksByColumn[colId].length;


  const totalTasks = projectTasks.length;
  const doneTasks = projectTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = projectTasks.filter(
    (t) => t.status === "inprogress"
  ).length;
  const todoTasks = projectTasks.filter((t) => t.status === "todo").length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((doneTasks * 100) / totalTasks);


  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const copy = { ...tasksByColumn };
    const [moved] = copy[sourceCol].splice(source.index, 1);

    moved.status = destCol;
    copy[destCol].splice(destination.index, 0, moved);

    const other = tasks.filter((t) => t.projectId !== effectiveProjectId);
    const merged = [...other, ...copy.todo, ...copy.inprogress, ...copy.done];
    updateTasks(merged);
  };


  const openTaskModal = (task) => {
    setModalTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    updateTasks((prev) => prev.filter((t) => t.id !== task.id));
    setModalOpen(false);
    setModalTask(null);
  };

  const handleEditTask = (task) => {

    console.log("✏️ Modifier (front only) :", task);
    setModalOpen(false);
    setModalTask(null);
  };

  const handleCreateTaskClick = () => {
    if (!effectiveProjectId) return;
    navigate(`/app/projects/${effectiveProjectId}/add-task`);
  };


  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/70 shadow-sm px-6 py-6 md:px-8 md:py-7 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-indigo-100 text-xs font-semibold text-indigo-600 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Tableau de tâches
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Mes tâches {currentProject ? `– ${currentProject.name}` : ""}
              </h1>
              {currentProject ? (
                <p className="text-sm text-slate-600">
                  Organise, priorise et visualise le travail de ce projet.
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Sélectionne un projet pour voir et créer ses tâches.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-[260px]">
       
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Projet courant
                </span>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-indigo-500">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <select
                    value={effectiveProjectId || ""}
                    onChange={handleProjectChange}
                    className="w-full rounded-2xl border border-indigo-100 bg-white/80 pl-9 pr-9 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm appearance-none"
                  >
                    <option value="">Sélectionner un projet</option>
                    {MOCK_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <SortDesc className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <PrimaryPillButton icon={Sparkles} disabled>
                  Prioriser avec l’IA
                </PrimaryPillButton>
                <SecondaryPillButton
                  icon={Plus}
                  onClick={handleCreateTaskClick}
                  disabled={!effectiveProjectId}
                >
                  Nouvelle tâche
                </SecondaryPillButton>
              </div>
            </div>
          </div>
        </div>


        {effectiveProjectId && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total tâches"
              value={totalTasks}
              accent="indigo"
            />
            <StatCard
              label="À faire"
              value={todoTasks}
              accent="amber"
            />
            <StatCard
              label="En cours"
              value={inProgressTasks}
              accent="blue"
            />
            <StatCard
              label="Terminées"
              value={`${doneTasks} (${completionRate}%)`}
              accent="emerald"
            />
          </div>
        )}


        {effectiveProjectId && (
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une tâche..."
              wrapperClassName="flex-1 min-w-[260px] max-w-xl"
            />

            <FilterPill
              icon={Filter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={FILTER_OPTIONS}
            />
          </div>
        )}

 
        {!effectiveProjectId ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Users className="h-10 w-10 text-indigo-500" />
            </div>
            <p className="text-lg text-slate-700">
              Sélectionne d’abord un projet pour commencer à créer des tâches.
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {COLUMNS.map((col) => {
                const list = tasksByColumn[col.id];

                return (
                  <div key={col.id} className="flex flex-col">
        
                    <div className="mb-6 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                          col.color === "indigo"
                            ? "from-indigo-500 to-indigo-600"
                            : col.color === "orange"
                            ? "from-amber-500 to-orange-600"
                            : "from-emerald-500 to-teal-600"
                        } flex items-center justify-center shadow-md`}
                      >
                        <Sparkles className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {col.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {getTaskCount(col.id)} tâche
                          {getTaskCount(col.id) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

           
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-4 min-h-[420px] rounded-3xl ${
                            snapshot.isDraggingOver
                              ? "bg-indigo-50/40 p-4"
                              : ""
                          }`}
                        >
                          {list.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(providedDraggable, snapshotDraggable) => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  className={`${
                                    snapshotDraggable.isDragging
                                      ? "shadow-2xl rotate-2"
                                      : ""
                                  }`}
                                >
                                  <TaskCard
                                    task={task}
                                    columnColor={col.color}
                                    dueInfo={{
                                      text: task.dueLabel,
                                      color: task.dueColor,
                                    }}
                                    onOpen={openTaskModal}
                                    onEdit={openTaskModal}
                                    onDelete={handleDeleteTask}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}

                          {list.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-slate-200 rounded-3xl bg-slate-50/40">
                              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                              Aucune tâche ici
                            </div>
                          )}

                    
                          <QuickAddTask
                            columnId={col.id}
                            projectId={effectiveProjectId}
                            onAdd={(newTask) =>
                              updateTasks((prev) => [...prev, newTask])
                            }
                          />
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      <TaskDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalTask(null);
        }}
        task={modalTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </AppPage>
  );
}


function StatCard({ label, value, accent }) {
  const accentClasses =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : accent === "amber"
      ? "bg-amber-50 text-amber-700"
      : accent === "blue"
      ? "bg-sky-50 text-sky-700"
      : "bg-indigo-50 text-indigo-700";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div
        className={`w-9 h-9 rounded-2xl ${accentClasses} flex items-center justify-center text-xs font-semibold`}
      >
        {label[0]}
      </div>
    </div>
  );
}


function QuickAddTask({ columnId, projectId, onAdd }) {
  const [title, setTitle] = useState("");

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;

    const newTask = {
      id: Date.now(), 
      projectId,
      title: value,
      status: columnId,
      dueLabel: "Sans échéance",
      dueColor: "gray",
      tags: [],
      priority: "medium",
      estimateHours: null,
      assigneeName: "Toi",
      description: "",
    };

    onAdd(newTask);
    setTitle("");
  };

}
