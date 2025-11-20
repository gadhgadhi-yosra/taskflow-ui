
// import {
//   X,
//   Flag,
//   CalendarDays,
//   Tag,
//   Timer,
//   Pencil,
//   Trash2,
// } from "lucide-react";

// export default function TaskDetailsModal({
//   open,
//   onClose,
//   task,
//   onEdit,
//   onDelete,
// }) {
//   if (!open || !task) return null;

//   const priorityColors = {
//     low: "bg-emerald-100 text-emerald-700 border-emerald-200",
//     medium: "bg-blue-100 text-blue-700 border-blue-200",
//     high: "bg-orange-100 text-orange-700 border-orange-200",
//     critical: "bg-red-100 text-red-700 border-red-300",
//   };

//   const statusLabels = {
//     todo: "À faire",
//     inprogress: "En cours",
//     done: "Terminée",
//   };

//   const letter =
//     task.assigneeName && task.assigneeName.length > 0
//       ? task.assigneeName[0].toUpperCase()
//       : "T";

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />


//       <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">

//         <div className="flex items-start justify-between mb-6">
//           <h2 className="text-2xl font-bold text-slate-900">
//             {task.title}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-slate-100 transition"
//           >
//             <X className="h-5 w-5 text-slate-500" />
//           </button>
//         </div>


//         <div className="space-y-5">
       
//           <div className="flex flex-wrap items-center gap-3">
//             {task.priority && (
//               <span
//                 className={`px-3 py-1.5 rounded-full border text-sm font-medium inline-flex items-center gap-1.5 ${
//                   priorityColors[task.priority] || priorityColors.medium
//                 }`}
//               >
//                 <Flag className="h-4 w-4" />
//                 Priorité : {task.priority}
//               </span>
//             )}

//             {task.status && (
//               <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium inline-flex items-center gap-1.5">
//                 {statusLabels[task.status] || task.status}
//               </span>
//             )}

//             {task.estimateHours != null && (
//               <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-sm text-indigo-700 font-medium inline-flex items-center gap-1.5">
//                 <Timer className="h-4 w-4" />
//                 {task.estimateHours}h estimées
//               </span>
//             )}
//           </div>


//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
//               {letter}
//             </div>
//             <div>
//               <p className="text-sm text-slate-600">Assignée à</p>
//               <p className="font-medium text-slate-900">
//                 {task.assigneeName || "Non définie"}
//               </p>
//             </div>
//           </div>

      
//           <div className="flex items-center gap-3">
//             <CalendarDays className="h-5 w-5 text-slate-500" />
//             <div>
//               <p className="text-sm text-slate-600">Échéance</p>
//               <p className="font-medium text-slate-900">
//                 {task.dueLabel || "Non définie"}
//               </p>
//             </div>
//           </div>


//           {task.tags?.length > 0 && (
//             <div>
//               <p className="text-sm text-slate-600 mb-1">Tags</p>
//               <div className="flex flex-wrap gap-2">
//                 {task.tags.map((t, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs inline-flex items-center gap-1"
//                   >
//                     <Tag className="h-3 w-3" />
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}


//           <div>
//             <p className="text-sm text-slate-600 mb-1">Description</p>
//             <p className="text-slate-800 whitespace-pre-line leading-relaxed">
//               {task.description || "Aucune description fournie."}
//             </p>
//           </div>
//         </div>


//         <div className="flex justify-end gap-3 mt-8">
//           <button
//             onClick={() => onDelete(task)}
//             className="px-5 py-2.5 flex items-center gap-2 rounded-2xl border border-red-300 text-red-700 text-sm bg-red-50 hover:bg-red-100"
//           >
//             <Trash2 className="h-4 w-4" />
//             Supprimer
//           </button>

//           <button
//             onClick={() => onEdit(task)}
//             className="px-6 py-2.5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition"
//           >
//             <Pencil className="h-4 w-4" />
//             Modifier
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/tasks/TaskDetailsModal.jsx
import {
  X,
  Flag,
  CalendarDays,
  Tag,
  Timer,
  Pencil,
  Trash2,
} from "lucide-react";

export default function TaskDetailsModal({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
}) {
  if (!open || !task) return null;

  const priorityColors = {
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-300",
  };

  const statusLabels = {
    todo: "À faire",
    inprogress: "En cours",
    done: "Terminée",
  };

  const letter =
    task.assigneeName && task.assigneeName.length > 0
      ? task.assigneeName[0].toUpperCase()
      : "T";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* contenu modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-5">
          {/* PRIORITÉ / STATUT / ESTIMATION */}
          <div className="flex flex-wrap items-center gap-3">
            {task.priority && (
              <span
                className={`px-3 py-1.5 rounded-full border text-sm font-medium inline-flex items-center gap-1.5 ${
                  priorityColors[task.priority] || priorityColors.medium
                }`}
              >
                <Flag className="h-4 w-4" />
                Priorité : {task.priority}
              </span>
            )}

            {task.status && (
              <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium inline-flex items-center gap-1.5">
                {statusLabels[task.status] || task.status}
              </span>
            )}

            {task.estimateHours != null && (
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-sm text-indigo-700 font-medium inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4" />
                {task.estimateHours}h estimées
              </span>
            )}
          </div>

          {/* ASSIGNÉ */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {letter}
            </div>
            <div>
              <p className="text-sm text-slate-600">Assignée à</p>
              <p className="font-medium text-slate-900">
                {task.assigneeName || "Non définie"}
              </p>
            </div>
          </div>

          {/* ÉCHÉANCE */}
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-600">Échéance</p>
              <p className="font-medium text-slate-900">
                {task.dueLabel || "Non définie"}
              </p>
            </div>
          </div>

          {/* TAGS */}
          {task.tags?.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-1">Tags</p>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs inline-flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm text-slate-600 mb-1">Description</p>
            <p className="text-slate-800 whitespace-pre-line leading-relaxed">
              {task.description || "Aucune description fournie."}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => onDelete(task)}
            className="px-5 py-2.5 flex items-center gap-2 rounded-2xl border border-red-300 text-red-700 text-sm bg-red-50 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>

          <button
            onClick={() => onEdit(task)}
            className="px-6 py-2.5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            <Pencil className="h-4 w-4" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
