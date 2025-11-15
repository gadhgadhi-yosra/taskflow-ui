import { Home, FolderKanban, CheckSquare, Users, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Tableau de bord", path: "/dashboard" },
  { icon: FolderKanban, label: "Projets", path: "/dashboard/projects" },
  { icon: CheckSquare, label: "Mes tâches", path: "/dashboard/tasks" },
  { icon: Users, label: "Équipe", path: "/dashboard/team" },
  { icon: Settings, label: "Paramètres", path: "/dashboard/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">TaskFlow</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
          <LogOut className="h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
};
