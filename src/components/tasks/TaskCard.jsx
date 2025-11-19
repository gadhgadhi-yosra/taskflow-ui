
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function TaskCard({
  task,
  columnColor,
  dueInfo,
  onOpen,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const letter = (task.assigneeName || "T")[0].toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        onClick={() => onOpen(task)}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative cursor-pointer"
      >
        <div
          className={`h-1 rounded-t-3xl mb-4 ${
            columnColor === "indigo"
              ? "bg-indigo-500"
              : columnColor === "orange"
              ? "bg-orange-500"
              : "bg-emerald-500"
          }`}
        />

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
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

        {/* Titre */}
        <h3 className="font-semibold text-gray-900 mb-4 pr-8">
          {task.title}
        </h3>

        {/* Due date + priorité */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-2 h-2 rounded-full ${
              dueInfo.color === "red"
                ? "bg-red-500"
                : dueInfo.color === "indigo"
                ? "bg-indigo-500"
                : "bg-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              dueInfo.color === "red" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {dueInfo.text}
          </span>
          {task.priority && (
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700 font-semibold">
              {task.priority === "high"
                ? "Haute"
                : task.priority === "critical"
                ? "Critique"
                : task.priority === "low"
                ? "Basse"
                : "Normale"}
            </span>
          )}
        </div>

        {/* Assignee + menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md bg-indigo-600">
              {letter}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {task.assigneeName || "Non assignée"}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 w-48"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(task);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3 text-sm"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(task);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
