import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const NotificationBell = () => {
  const unreadCount = 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 w-80 bg-card">
        <div className="p-2">
          <h3 className="mb-2 font-semibold">Notifications</h3>
          <p className="py-4 text-center text-sm text-muted-foreground">Aucune notification</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
