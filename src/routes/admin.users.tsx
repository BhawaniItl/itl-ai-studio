/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Plus } from "lucide-react";
import { useAdminUsers } from "@/hooks";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/features/admin/AdminSkeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  CheckCircle,
 Ban,
  Trash2,
  History,
} from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
});

function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const {data, isLoading, } = useAdminUsers({page,limit: 10,search,role,status,plan,sort, order,});
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage workspace members, roles and plans.</p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-soft">
          <Plus className="h-4 w-4" /> Invite user
        </Button>
      </div>
      {isLoading && !data ? <TableSkeleton rows={8} cols={5} /> : (
      <Card className="p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
                className="h-10 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
          <Select
            value={role}
            onValueChange={(value) => {
              setPage(1);
              setRole(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              setPage(1);
              setStatus(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="DELETED">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={plan}
            onValueChange={(value) => {
              setPage(1);
              setPlan(value === "all" ? "" : value);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="GST">GST</SelectItem>
              <SelectItem value="IT">Income Tax</SelectItem>
              <SelectItem value="COMBO">Combo</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setRole("");
              setStatus("");
              setPlan("");
              setPage(1);
            }}
          >
            Reset
          </Button>

        </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Joined</TableHead>
              <TableHead className="text-center">Last Logged In At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.items ?? []).map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-[11px] font-bold text-primary-foreground">
                      {u.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{u.plan}</Badge></TableCell>
                <TableCell className="capitalize text-sm">{u.role}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      u.status === "APPROVED" && "bg-success/10 text-success hover:bg-success/10",
                      u.status === "PENDING" && "bg-info/10 text-info hover:bg-info/10",
                      u.status === "SUSPENDED" && "bg-destructive/10 text-destructive hover:bg-destructive/10",
                      u.status === "DELETED" && "bg-destructive/10 text-destructive hover:bg-destructive/10",
                    )}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{u.created_at}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{u.last_login}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {["PENDING", "SUSPENDED"].includes(u.status) && (
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                      )}

                      {u.status === "APPROVED" && (
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-yellow-600" />
                          Suspend
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <History className="mr-2 h-4 w-4" />
                        History
                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}
    </>
  );
}
