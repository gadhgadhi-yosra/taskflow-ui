import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const AITaskSuggestions = ({ projectId, projectName, projectDescription, onTaskAdded }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(null);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `Projet: ${projectName}\n${projectDescription ? `Description: ${projectDescription}\n` : ""}Génère des suggestions de tâches pour ce projet.`;
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: [{ role: "user", content: prompt }], type: "suggest" },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Erreur", description: data.error, variant: "destructive" });
        return;
      }
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de générer des suggestions.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (suggestion, index) => {
    setIsAdding(index);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      const { error } = await supabase.from("tasks").insert({
        title: suggestion.title,
        priority: suggestion.priority,
        category: suggestion.category,
        status: "todo",
        project_id: projectId,
        user_id: user.id,
      });
      if (error) throw error;

      toast({ title: "Tâche ajoutée", description: "La tâche a été ajoutée avec succès." });
      setSuggestions((prev) => prev.filter((_, i) => i !== index));
      onTaskAdded?.();
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible d'ajouter la tâche.", variant: "destructive" });
    } finally {
      setIsAdding(null);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "destructive";
    if (priority === "medium") return "default";
    if (priority === "low") return "secondary";
    return "default";
    };

  return (
    <div className="space-y-4">
      <Button onClick={generateSuggestions} disabled={isLoading} variant="outline" className="w-full">
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Génération en cours...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Suggérer des tâches avec l'IA</>)}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Suggestions de tâches :</h4>
          {suggestions.map((s, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{s.title}</p>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(s.priority)}>{s.priority}</Badge>
                    <Badge variant="outline">{s.category}</Badge>
                  </div>
                </div>
                <Button size="sm" onClick={() => addTask(s, index)} disabled={isAdding === index}>
                  {isAdding === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
