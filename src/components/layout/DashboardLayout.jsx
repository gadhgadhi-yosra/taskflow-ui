
import { Link, useLocation } from "react-router-dom";
import { Home, FolderKanban, CheckSquare, Users, Settings, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", icon: Home, label: "Tableau de bord" },
  { to: "/app/projects", icon: FolderKanban, label: "Projets" },
  { to: "/app/tasks", icon: CheckSquare, label: "Mes tâches" },
  { to: "/app/team", icon: Users, label: "Équipe" },
  { to: "/app/settings", icon: Settings, label: "Paramètres" },
];

export const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-black dark:via-slate-950 dark:to-slate-900">

      <aside className="fixed left-0 top-0 z-50 h-full w-20 border-r border-white/20 bg-white/70 backdrop-blur-xl dark:bg-black/70">
        <div className="flex h-full flex-col justify-between py-6">
          <div className="space-y-8">
    
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">TaskFlow</span>
            </div>

       
            <nav className="space-y-3 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-12 w-12 rounded-2xl transition-all duration-300 hover:scale-110",
                        isActive &&
                          "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg hover:shadow-xl"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>


          <div className="px-3">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl text-red-500 hover:scale-110 hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

   
      <main className="pl-20">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};