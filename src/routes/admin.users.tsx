/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Loader2 } from "lucide-react";
import { useAdminUsers, useAdminUserDetail, useAdminUserHistory, useApproveUser, useSuspendUser, useDeleteUser, useUpdateUser } from "@/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/features/admin/AdminSkeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface UserRow {
  id: number;
  name: string;
  email: string;
  plan: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string | null;
}

function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data, isLoading, } = useAdminUsers({page,limit: 10,search,role,status,plan,sort, order,});

  const [viewUserId, setViewUserId] = useState<number | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [historyUserId, setHistoryUserId] = useState<number | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

  const approveMutation = useApproveUser();
  const suspendMutation = useSuspendUser();
  const deleteMutation = useDeleteUser();

  const handleApprove = (u: UserRow) => {
    approveMutation.mutate(
      { id: u.id, arg: undefined },
      {
        onSuccess: () => toast.success(`${u.name} approved`),
        onError: () => toast.error("Couldn't approve this user — please try again."),
      },
    );
  };

  const handleSuspend = (u: UserRow) => {
    suspendMutation.mutate(
      { id: u.id, arg: undefined },
      {
        onSuccess: () => toast.success(`${u.name} suspended`),
        onError: () => toast.error("Couldn't suspend this user — please try again."),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    deleteMutation.mutate(
      { id: deleteUser.id, arg: undefined },
      {
        onSuccess: () => {
          toast.success(`${deleteUser.name} deleted`);
          setDeleteUser(null);
        },
        onError: () => toast.error("Couldn't delete this user — please try again."),
      },
    );
  };

  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage workspace members, roles and plans.</p>
        </div>
        <Button
          className="gap-2 gradient-primary text-primary-foreground shadow-soft"
          disabled
          title="Not available yet — no invite endpoint exists on the backend"
        >
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
            {((data?.items ?? []) as UserRow[]).map((u) => (
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

                      <DropdownMenuItem onClick={() => setViewUserId(u.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setEditUserId(u.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {["PENDING", "SUSPENDED"].includes(u.status) && (
                        <DropdownMenuItem onClick={() => handleApprove(u)}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                      )}

                      {u.status === "APPROVED" && (
                        <DropdownMenuItem onClick={() => handleSuspend(u)}>
                          <Ban className="mr-2 h-4 w-4 text-yellow-600" />
                          Suspend
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteUser(u)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => setHistoryUserId(u.id)}>
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

      <ViewUserDialog userId={viewUserId} onOpenChange={(open) => !open && setViewUserId(null)} />
      <EditUserDialog userId={editUserId} onOpenChange={(open) => !open && setEditUserId(null)} />
      <HistoryDialog userId={historyUserId} onOpenChange={(open) => !open && setHistoryUserId(null)} />

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This soft-deletes the account — they'll immediately lose access. This can be reversed by an admin later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  telephone: string | null;
  fax: string | null;
  firm: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pin_code: string | null;
  plan: string | null;
  status: string;
  is_admin: boolean;
  is_staff: boolean;
  last_login: string | null;
  created_at: string;
}

function ViewUserDialog({ userId, onOpenChange }: { userId: number | null; onOpenChange: (open: boolean) => void }) {
  const { data, isLoading } = useAdminUserDetail(userId);
  const user = data as UserDetail | undefined;

  return (
    <Dialog open={userId != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user?.name ?? "User details"}</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : user ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Field label="Firm" value={user.firm} />
            <Field label="Plan" value={user.plan} />
            <Field label="Mobile" value={user.mobile} />
            <Field label="Telephone" value={user.telephone} />
            <Field label="Address" value={user.address} />
            <Field label="City" value={user.city} />
            <Field label="State" value={user.state} />
            <Field label="PIN Code" value={user.pin_code} />
            <Field label="Status" value={user.status} />
            <Field label="Role" value={user.is_admin ? "Admin" : user.is_staff ? "Staff" : "User"} />
            <Field label="Joined" value={user.created_at} />
            <Field label="Last login" value={user.last_login ?? "Never"} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Couldn't load this user.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{value || "—"}</p>
    </div>
  );
}

function EditUserDialog({ userId, onOpenChange }: { userId: number | null; onOpenChange: (open: boolean) => void }) {
  const { data, isLoading } = useAdminUserDetail(userId);
  const user = data as UserDetail | undefined;
  const updateMutation = useUpdateUser();
  const [form, setForm] = useState<Partial<UserDetail>>({});

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const set = <K extends keyof UserDetail>(key: K, value: UserDetail[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!userId) return;
    updateMutation.mutate(
      {
        id: userId,
        arg: {
          name: form.name,
          firm: form.firm,
          mobile: form.mobile,
          telephone: form.telephone,
          address: form.address,
          city: form.city,
          state: form.state,
          pin_code: form.pin_code,
          is_admin: form.is_admin,
          is_staff: form.is_staff,
        },
      },
      {
        onSuccess: () => {
          toast.success("User updated");
          onOpenChange(false);
        },
        onError: () => toast.error("Couldn't save changes — please try again."),
      },
    );
  };

  return (
    <Dialog open={userId != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="firm">Firm</Label>
                <Input id="firm" value={form.firm ?? ""} onChange={(e) => set("firm", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" value={form.mobile ?? ""} onChange={(e) => set("mobile", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="telephone">Telephone</Label>
                <Input id="telephone" value={form.telephone ?? ""} onChange={(e) => set("telephone", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pin">PIN Code</Label>
                <Input id="pin" value={form.pin_code ?? ""} onChange={(e) => set("pin_code", e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="is_admin" className="text-sm font-normal">Admin access</Label>
              <Switch id="is_admin" checked={!!form.is_admin} onCheckedChange={(v) => set("is_admin", v)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <Label htmlFor="is_staff" className="text-sm font-normal">Staff access</Label>
              <Switch id="is_staff" checked={!!form.is_staff} onCheckedChange={(v) => set("is_staff", v)} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending || isLoading} className="gap-1.5">
            {updateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({ userId, onOpenChange }: { userId: number | null; onOpenChange: (open: boolean) => void }) {
  const { data, isLoading } = useAdminUserHistory(userId);
  const items = (data?.items ?? []) as { label?: string; description?: string; created_at?: string }[];

  return (
    <Dialog open={userId != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account history</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : items.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {items.map((item, i) => (
              <li key={i} className="rounded-lg border border-border/60 p-2.5">
                <p className="font-medium">{item.label}</p>
                {item.description && <p className="text-muted-foreground">{item.description}</p>}
                {item.created_at && <p className="mt-1 text-[11px] text-muted-foreground">{item.created_at}</p>}
              </li>
            ))}
          </ul>
        ) : (
          // Backend currently always returns an empty history list — this
          // is an honest empty state, not a loading/error mistake.
          <p className="py-4 text-center text-sm text-muted-foreground">No history recorded for this account yet.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
