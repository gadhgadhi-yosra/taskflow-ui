import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const EditTaskDialog = ({ task, open, onOpenChange, onTaskUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("À faire");
  const [priority, setPriority] = useState("Moyenne");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "À faire");
      setPriority(task.priority || "Moyenne");
      setDueDate(task.due_date || "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("tasks").update({
        title,
        description: description || null,
        status,
        priority,
        due_date: dueDate || null,
      }).eq("id", task.id);

      if (error) throw error;

      toast({ title: "Tâche mise à jour", description: "La tâche a été modifiée avec succès" });
      onTaskUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
      toast({ title: "Erreur", description: "Impossible de modifier la tâche", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la tâche</DialogTitle>
          <DialogDescription>Modifiez les détails de la tâche</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom de la tâche" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description détaillée" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="À faire">À faire</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En révision">En révision</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="Basse">Basse</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
