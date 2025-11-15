import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getPriorityColor = (priority) => {
  const p = (priority || "").toLowerCase();
  if (p === "haute") return "bg-destructive text-destructive-foreground";
  if (p === "moyenne") return "bg-warning text-warning-foreground";
  if (p === "basse") return "bg-success text-success-foreground";
  return "bg-muted text-muted-foreground";
};

export const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <Card className="group relative overflow-hidden p-4 transition-all hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="mb-2 font-semibold">{task.title}</h4>
          {task.description && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}
          <div className="flex flex-wrap gap-2">
            {task.project && <Badge variant="outline" className="text-xs">📁 {task.project.name}</Badge>}
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            {task.due_date && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString("fr-FR")}
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card">
            <DropdownMenuItem onClick={() => onEdit(task)}><Pencil className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
