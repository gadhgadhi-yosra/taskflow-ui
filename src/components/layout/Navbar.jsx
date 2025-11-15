import { Button } from "@/components/ui/button";
import { Menu, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = ({ onMenuClick, showMenuButton = false }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login"><Button variant="ghost">Connexion</Button></Link>
          <Link to="/signup"><Button>Commencer</Button></Link>
        </div>
      </div>
    </nav>
  );
};
