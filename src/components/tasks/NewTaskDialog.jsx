import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewTaskDialog = ({ open, onOpenChange, projectId, projects, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("À faire");
  const [priority, setPriority] = useState("Moyenne");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un projet.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("tasks").insert({
      title,
      description,
      status,
      priority,
      project_id: selectedProjectId,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Erreur", description: "Impossible de créer la tâche. Veuillez réessayer.", variant: "destructive" });
      return;
    }

    toast({ title: "Tâche créée", description: "La tâche a été créée avec succès." });
    setTitle(""); setDescription(""); setStatus("À faire"); setPriority("Moyenne");
    onOpenChange(false); onTaskCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle tâche</DialogTitle>
          <DialogDescription>Créez une nouvelle tâche pour votre projet</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Titre *</Label>
            <Input id="task-title" placeholder="Ex: Créer la maquette homepage" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea id="task-description" placeholder="Décrivez la tâche..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="task-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="À faire">À faire</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En revue">En revue</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basse">Basse</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!projectId && (
            <div className="space-y-2">
              <Label>Projet *</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger id="task-project"><SelectValue placeholder="Sélectionner un projet" /></SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer la tâche"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
