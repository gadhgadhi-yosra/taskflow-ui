import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  UserCircle
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: Home, label: "Tableau de bord", path: "/home" },
  { icon: FolderKanban, label: "Projets", path: "/home/projects" },
  { icon: CheckSquare, label: "Mes tâches", path: "/home/tasks" },
  { icon: Users, label: "Équipe", path: "/home/team" },
  { icon: Settings, label: "Paramètres", path: "/home/settings" },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <aside className="flex h-full w-64 flex-col border-r border-border bg-card animate-pulse">
        <div className="h-16 border-b border-border" />
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-border p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-medium">
              {user.displayName?.[0] || user.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.displayName || "Utilisateur"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          size="sm"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </aside>
  );
};