import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Brain,
  Sparkles,
  MoreVertical,
  Filter,
  Edit2,
  Trash2,
} from "lucide-react";
import { format, isToday, isTomorrow, isPast, addDays } from "date-fns";
import { fr } from "date-fns/locale";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import {
  PrimaryPillButton,
  SecondaryPillButton,
} from "@/components/app/ActionButtons";


const initialTasks = {
  todo: [
    {
      id: "1",
      title: "Design de la homepage",
      due: new Date(),
      assignee: "Toi",
      tags: ["UI", "Figma"],
      completed: false,
    },
    {
      id: "2",
      title: "Implémenter l’authentification",
      due: addDays(new Date(), 1),
      assignee: "Dev",
      tags: ["Backend"],
      completed: false,
    },
  ],
  inProgress: [
    {
      id: "3",
      title: "Développement API backend",
      due: new Date(),
      assignee: "Toi",
      tags: ["API", "Urgent"],
      completed: false,
    },
  ],
  done: [
    {
      id: "4",
      title: "Setup projet + Git",
      due: new Date(Date.now() - 86400000 * 3),
      assignee: "Toi",
      tags: ["DevOps"],
      completed: true,
    },
  ],
};

const columns = [
  { id: "todo", title: "À faire", color: "indigo" },
  { id: "inProgress", title: "En cours", color: "orange" },
  { id: "done", title: "Terminé", color: "emerald" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "Toutes les tâches" },
  { value: "today", label: "Aujourd’hui" },
  { value: "urgent", label: "Urgent" },
  { value: "mine", label: "Assignées à moi" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);


  const applyFilters = (taskList) =>
    taskList.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.tags.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );
      if (!matchesSearch) return false;

      if (filter === "today") return isToday(task.due);
      if (filter === "urgent") return task.tags.includes("Urgent");
      if (filter === "mine") return task.assignee === "Toi";
      return true;
    });

  const getTaskCount = (colId) => applyFilters(tasks[colId]).length;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = Array.from(tasks[source.droppableId]);
    const destCol =
      source.droppableId === destination.droppableId
        ? sourceCol
        : Array.from(tasks[destination.droppableId]);
    const [moved] = sourceCol.splice(source.index, 1);

    if (destination.droppableId === "done") moved.completed = true;
    if (
      source.droppableId === "done" &&
      destination.droppableId !== "done"
    )
      moved.completed = false;

    destCol.splice(destination.index, 0, moved);

    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));
  };

  const getDueDisplay = (date) => {
    if (isToday(date)) return { text: "Aujourd’hui", color: "indigo" };
    if (isTomorrow(date)) return { text: "Demain", color: "gray" };
    if (isPast(date)) return { text: "En retard", color: "red" };
    return {
      text: format(date, "d MMM", { locale: fr }),
      color: "gray",
    };
  };

  const deleteTask = (taskId, colId) => {
    setTasks((prev) => ({
      ...prev,
      [colId]: prev[colId].filter((t) => t.id !== taskId),
    }));
    setMenuOpen(null);
  };

  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Mes tâches
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Organisez, priorisez et visualisez votre travail.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryPillButton icon={Brain}>
                Prioriser avec l’IA
              </PrimaryPillButton>
              <SecondaryPillButton icon={Plus}>
                Nouvelle tâche
              </SecondaryPillButton>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
        </div>


        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col) => {
              const taskList = applyFilters(tasks[col.id]);

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
                        className={`space-y-4 min-h-[500px] ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-50/30 rounded-3xl p-4"
                            : ""
                        }`}
                      >
                        {taskList.map((task, index) => {
                          const due = getDueDisplay(task.due);
                          const currentColId = Object.keys(tasks).find(
                            (key) =>
                              tasks[key].some((t) => t.id === task.id)
                          );

                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative ${
                                      snapshot.isDragging
                                        ? "shadow-2xl rotate-2"
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className={`h-1 rounded-t-3xl mb-4 ${
                                        col.color === "indigo"
                                          ? "bg-indigo-500"
                                          : col.color === "orange"
                                          ? "bg-orange-500"
                                          : "bg-emerald-500"
                                      }`}
                                    />

                                    {task.tags?.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {task.tags.map((tag) => (
                                          <span
                                            key={tag}
                                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    <h3 className="font-semibold text-gray-900 mb-4 pr-8">
                                      {task.title}
                                    </h3>

                                    <div className="flex items-center gap-3 mb-6">
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          due.color === "red"
                                            ? "bg-red-500"
                                            : due.color === "indigo"
                                            ? "bg-indigo-500"
                                            : "bg-gray-400"
                                        }`}
                                      />
                                      <span
                                        className={`text-sm font-medium ${
                                          due.color === "red"
                                            ? "text-red-600"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {due.text}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                                            task.assignee === "Toi"
                                              ? "bg-indigo-600"
                                              : "bg-purple-600"
                                          }`}
                                        >
                                          {task.assignee[0]}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                          {task.assignee}
                                        </span>
                                      </div>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMenuOpen(
                                            menuOpen === task.id
                                              ? null
                                              : task.id
                                          );
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                                      >
                                        <MoreVertical className="h-5 w-5 text-gray-400" />
                                      </button>

                                      <AnimatePresence>
                                        {menuOpen === task.id && (
                                          <motion.div
                                            initial={{
                                              opacity: 0,
                                              scale: 0.95,
                                            }}
                                            animate={{
                                              opacity: 1,
                                              scale: 1,
                                            }}
                                            exit={{
                                              opacity: 0,
                                              scale: 0.95,
                                            }}
                                            className="absolute right-4 top-20 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 w-48"
                                          >
                                            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3">
                                              <Edit2 className="h-4 w-4" />{" "}
                                              Modifier
                                            </button>
                                            <button
                                              onClick={() =>
                                                deleteTask(
                                                  task.id,
                                                  currentColId
                                                )
                                              }
                                              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3"
                                            >
                                              <Trash2 className="h-4 w-4" />{" "}
                                              Supprimer
                                            </button>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {taskList.length === 0 && (
                          <div className="text-center py-20 text-gray-400">
                            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>Aucune tâche ici</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </AppPage>
  );
}
