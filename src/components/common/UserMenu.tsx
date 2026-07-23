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
        <button className="outline-none">
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem asChild>
          <Link to="/profile">
            Profile
          </Link>
        </DropdownMenuItem>

        {user?.is_admin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}