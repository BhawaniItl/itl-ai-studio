/* eslint-disable prettier/prettier */
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  useCurrentUser,
  useClearAuth,
} from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { ChevronDown, LogOut, Shield, User } from "lucide-react";


export function UserMenu() {
  const user = useCurrentUser();
  const clear = useClearAuth();
  const navigate = useNavigate();

  const initials =
    user?.name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const logout = async () => {
    try {
      await authService.logout();
    } catch { /* empty */ }

    clear();

    navigate({
      to: "/",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <button
              className="
              group flex items-center gap-3 rounded-xl
              border border-border/60 bg-card
              px-2 py-1.5
              transition-all
              hover:bg-secondary
              hover:shadow-sm
              "
          >
              <Avatar className="h-7 w-7 ring-2 ring-primary/15 transition-all group-hover:ring-primary/30">
                <AvatarFallback className="gradient-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                </AvatarFallback>
              </Avatar>

              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        {user?.is_admin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          Sign Out
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}