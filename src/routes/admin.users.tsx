import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Plus } from "lucide-react";
import { useAdminUsers } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/features/admin/AdminSkeletons";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
});

function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
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
      {isLoading && !users ? <TableSkeleton rows={8} cols={5} /> : (
      <Card className="p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users…" className="h-10 pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users ?? []).map((u) => (
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
                      u.status === "active" && "bg-success/10 text-success hover:bg-success/10",
                      u.status === "invited" && "bg-info/10 text-info hover:bg-info/10",
                      u.status === "suspended" && "bg-destructive/10 text-destructive hover:bg-destructive/10",
                    )}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{u.joinedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}
    </>
  );
}
