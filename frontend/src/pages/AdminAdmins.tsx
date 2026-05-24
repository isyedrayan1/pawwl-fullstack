import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, ShieldPlus, UserRound, Edit3 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, ApiAdminUser } from "@/lib/api";

type NewAdminForm = {
  name: string;
  username: string;
  email: string;
  password: string;
};

const initialNewAdmin: NewAdminForm = {
  name: "",
  username: "",
  email: "",
  password: "",
};

const AdminAdmins = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NewAdminForm>(initialNewAdmin);
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<ApiAdminUser | null>(null);
  const [changePasswordFor, setChangePasswordFor] = useState<string | null>(null);

  const { data, error } = useQuery({
    queryKey: ["admin-admins"],
    queryFn: () => apiRequest<{ admins: ApiAdminUser[] }>("/api/admin/admins"),
    retry: false,
  });

  const createAdmin = useMutation({
    mutationFn: (payload: NewAdminForm) =>
      apiRequest<{ admin: ApiAdminUser }>("/api/admin/admins", {
        method: "POST",
        body: JSON.stringify({
          name: payload.name || undefined,
          username: payload.username,
          email: payload.email || undefined,
          password: payload.password,
        }),
      }),
    onSuccess: () => {
      toast.success("Admin account created");
      setForm(initialNewAdmin);
      queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Could not create admin"),
  });

  const updatePassword = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      apiRequest(`/api/admin/admins/${id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      }),
    onSuccess: (_data, vars) => {
      toast.success("Admin password updated");
      setPasswordDrafts((current) => ({ ...current, [vars.id]: "" }));
      setChangePasswordFor(null);
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Password update failed"),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createAdmin.mutate(form);
  };

  return (
    <AdminShell
      title="Admins"
      description="Create additional admin accounts and rotate admin passwords safely from one place."
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Admin accounts could not be loaded.
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-dark">Admins</h1>
          <p className="text-sm text-[#666]">Manage admin accounts for the site.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#666]">Total: <span className="font-medium text-brand-dark">{data?.admins.length ?? 0}</span></div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">Add admin</Button>
            </DialogTrigger>
            <DialogContent data-side="right" className="w-full sm:w-[420px]">
              <DialogHeader>
                <DialogTitle>Add admin</DialogTitle>
                <DialogDescription>Use a unique username and a strong password.</DialogDescription>
              </DialogHeader>

              <form onSubmit={(e) => { e.preventDefault(); createAdmin.mutate(form); setAddOpen(false); }} className="grid gap-3">
                <Input placeholder="Display name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <Input placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.toLowerCase() })} required />
                <Input type="email" placeholder="Email (optional)" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value.toLowerCase() })} />
                <Input type="password" placeholder="Temporary password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />

                <DialogFooter>
                  <Button type="submit" className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">Create admin</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {data?.admins.map((admin) => {
          const password = passwordDrafts[admin.id] ?? "";

          return (
            <div key={admin.id} className="rounded-[2rem] border border-border-design bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-lg font-semibold text-brand-dark">{admin.name}</p>
                    <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">{admin.status}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#666]">
                    <span className="inline-flex items-center gap-1">
                      <UserRound size={14} />
                      {admin.username || "-"}
                    </span>
                    <span>{admin.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-xs text-[#888]">Created {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(admin.createdAt || Date.now()))}</p>
                  <Button
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); setSelectedAdmin(admin); setEditOpen(true); }}
                    className="rounded-full p-2"
                  >
                    <Edit3 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {!data?.admins.length && <p className="text-sm text-[#666]">No admin accounts available.</p>}
      </div>

      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) setSelectedAdmin(null); setEditOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin details</DialogTitle>
            <DialogDescription>View details and rotate password.</DialogDescription>
          </DialogHeader>

          {selectedAdmin && (
            <div className="grid gap-3">
              <div className="text-sm text-[#666]"><strong>Name:</strong> {selectedAdmin.name}</div>
              <div className="text-sm text-[#666]"><strong>Username:</strong> {selectedAdmin.username || "-"}</div>
              <div className="text-sm text-[#666]"><strong>Email:</strong> {selectedAdmin.email || "-"}</div>
              <div className="text-sm text-[#666]"><strong>Status:</strong> {selectedAdmin.status}</div>
              <div className="text-sm text-[#666]"><strong>Created:</strong> {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(selectedAdmin.createdAt || Date.now()))}</div>

              <div className="mt-3">
                {changePasswordFor === selectedAdmin.id ? (
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <Input
                      type="password"
                      placeholder="New password"
                      value={passwordDrafts[selectedAdmin.id] ?? ""}
                      onChange={(event) => setPasswordDrafts((current) => ({ ...current, [selectedAdmin.id]: event.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={updatePassword.isPending || (passwordDrafts[selectedAdmin.id] ?? "").length < 8}
                        className="rounded-full bg-brand-blue text-white hover:bg-brand-dark"
                        onClick={() => updatePassword.mutate({ id: selectedAdmin.id, password: passwordDrafts[selectedAdmin.id] ?? "" })}
                      >
                        <KeyRound size={16} />
                        Confirm
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => { setChangePasswordFor(null); setPasswordDrafts((c) => ({ ...c, [selectedAdmin.id]: "" })); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" className="rounded-full bg-brand-blue text-white hover:bg-brand-dark" onClick={() => setChangePasswordFor(selectedAdmin.id)}>
                    <KeyRound size={16} />
                    Change password
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
};

export default AdminAdmins;
