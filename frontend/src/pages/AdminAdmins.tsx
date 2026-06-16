import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, ShieldPlus, UserRound, Edit3, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, ApiAdminUser, ApiAdminRole } from "@/lib/api";

type NewAdminForm = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  adminRoleId: string | null;
};

const initialNewAdmin: NewAdminForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "customer",
  adminRoleId: null,
};

type NewRoleForm = {
  name: string;
  permissions: string[];
};

const initialNewRole: NewRoleForm = {
  name: "",
  permissions: [],
};

const AVAILABLE_SCOPES = [
  { id: "manage_products", label: "Catalog & Products" },
  { id: "manage_orders", label: "Orders" },
  { id: "manage_fulfillment", label: "Fulfillment Queue" },
  { id: "manage_returns", label: "Returns" },
  { id: "manage_coupons", label: "Coupons & Discounts" },
  { id: "manage_reviews", label: "Product Reviews" },
  { id: "manage_users", label: "Customers" },
];

const AdminAdmins = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NewAdminForm>(initialNewAdmin);
  const [roleForm, setRoleForm] = useState<NewRoleForm>(initialNewRole);
  
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  
  const [selectedAdmin, setSelectedAdmin] = useState<ApiAdminUser | null>(null);
  const [changePasswordFor, setChangePasswordFor] = useState<string | null>(null);

  const { data: adminsData, isLoading: adminsLoading } = useQuery({
    queryKey: ["admin-admins"],
    queryFn: () => apiRequest<{ admins: ApiAdminUser[] }>("/api/admin/admins"),
    retry: false,
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => apiRequest<{ roles: ApiAdminRole[] }>("/api/admin/roles"),
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
          role: payload.role,
          adminRoleId: payload.adminRoleId || undefined,
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
      queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Password update failed"),
  });

  const createRole = useMutation({
    mutationFn: (payload: NewRoleForm) =>
      apiRequest<{ role: ApiAdminRole }>("/api/admin/roles", {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          permissions: payload.permissions.join(","),
        }),
      }),
    onSuccess: () => {
      toast.success("Role created successfully");
      setRoleForm(initialNewRole);
      setAddRoleOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Could not create role"),
  });

  const deleteRole = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/roles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Could not delete role"),
  });

  return (
    <AdminShell
      title="Access Control"
      description="Create admin accounts, assign roles, and manage detailed access permissions for your staff."
    >
      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2 rounded-full p-1 border border-border-design bg-slate-50">
          <TabsTrigger value="admins" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-dark data-[state=active]:shadow-sm">
            Staff Accounts
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-brand-dark data-[state=active]:shadow-sm">
            Manage Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="mt-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-brand-dark">Staff Accounts</h1>
              <p className="text-sm text-[#666]">Manage logins and passwords for your team.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-[#666]">Total: <span className="font-medium text-brand-dark">{adminsData?.admins.length ?? 0}</span></div>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">
                    <Plus size={16} className="mr-2" />
                    Add admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] p-6 rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add New Admin</DialogTitle>
                    <DialogDescription>Create a new staff account and assign their access role.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={(e) => { e.preventDefault(); createAdmin.mutate(form); setAddOpen(false); }} className="grid gap-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Display Name</label>
                        <Input className="h-11 rounded-xl" placeholder="John Doe" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Username</label>
                        <Input className="h-11 rounded-xl" placeholder="johndoe" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.toLowerCase() })} required />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Email (Optional)</label>
                      <Input className="h-11 rounded-xl" type="email" placeholder="john@pawwl.local" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value.toLowerCase() })} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Temporary Password</label>
                      <Input className="h-11 rounded-xl" type="password" placeholder="Min 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Access Role</label>
                      <Select 
                        value={form.role === "admin" ? "SUPER_ADMIN" : (form.adminRoleId || "")} 
                        onValueChange={(val) => {
                          if (val === "SUPER_ADMIN") {
                            setForm({ ...form, role: "admin", adminRoleId: null });
                          } else {
                            setForm({ ...form, role: "customer", adminRoleId: val });
                          }
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPER_ADMIN" className="font-bold text-brand-blue">Super Admin (All Access)</SelectItem>
                          {rolesData?.roles.map(r => (
                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={createAdmin.isPending} className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">Create account</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4">
            {adminsData?.admins.map((admin) => {
              const password = passwordDrafts[admin.id] ?? "";

              return (
                <div key={admin.id} className="rounded-[2rem] border border-border-design bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-lg font-semibold text-brand-dark">{admin.name}</p>
                        {admin.role === "admin" ? (
                          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue flex items-center gap-1">
                            <ShieldAlert size={12} /> Super Admin
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {admin.adminRole?.name || "Staff"}
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{admin.status}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#666]">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                          <UserRound size={14} />
                          {admin.username || "-"}
                        </span>
                        <span>{admin.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); setSelectedAdmin(admin); setEditOpen(true); }}
                        className="rounded-xl border-slate-200"
                      >
                        <KeyRound size={16} className="mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!adminsLoading && !adminsData?.admins.length && <p className="text-sm text-[#666] py-10 text-center">No admin accounts available.</p>}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-brand-dark">Dynamic Roles</h1>
              <p className="text-sm text-[#666]">Create custom roles and specify exact access scopes.</p>
            </div>
            
            <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">
                  <ShieldPlus size={16} className="mr-2" />
                  New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px] p-6 rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Create Custom Role</DialogTitle>
                  <DialogDescription>Define a role name and a comma-separated list of scopes.</DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); createRole.mutate(roleForm); }} className="grid gap-4 mt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Role Name</label>
                    <Input className="h-11 rounded-xl" placeholder="e.g. Warehouse Staff" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} required />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Access Scopes</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {AVAILABLE_SCOPES.map(scope => (
                        <label key={scope.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                            checked={roleForm.permissions.includes(scope.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, scope.id] });
                              } else {
                                setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(p => p !== scope.id) });
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-slate-700">{scope.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setAddRoleOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createRole.isPending} className="rounded-full bg-brand-blue text-white hover:bg-brand-dark">Save Role</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rolesData?.roles.map((role) => (
              <div key={role.id} className="rounded-[2rem] border border-border-design bg-white p-5 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-brand-dark">{role.name}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {role._count?.users || 0} users
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Granted Scopes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.split(",").map(p => p.trim()).filter(Boolean).map(perm => (
                      <span key={perm} className="rounded-md bg-brand-light/30 border border-brand-blue/20 text-brand-blue px-2 py-1 text-[11px] font-mono">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl px-3"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this role?")) {
                        deleteRole.mutate(role.id);
                      }
                    }}
                    disabled={role._count?.users ? role._count.users > 0 : false}
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Delete Role
                  </Button>
                </div>
              </div>
            ))}
            
            {!rolesLoading && !rolesData?.roles.length && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50">
                <ShieldPlus size={32} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-medium text-slate-700">No custom roles yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">Create a custom role to group permissions and assign them to your staff.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Admin Password Modal */}
      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) setSelectedAdmin(null); setEditOpen(open); }}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Admin details</DialogTitle>
            <DialogDescription>View details and rotate password.</DialogDescription>
          </DialogHeader>

          {selectedAdmin && (
            <div className="grid gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <div className="text-sm text-slate-700 flex justify-between">
                  <span className="text-slate-400">Name</span> 
                  <span className="font-medium text-brand-dark">{selectedAdmin.name}</span>
                </div>
                <div className="text-sm text-slate-700 flex justify-between">
                  <span className="text-slate-400">Username</span> 
                  <span className="font-medium text-brand-dark">{selectedAdmin.username || "-"}</span>
                </div>
                <div className="text-sm text-slate-700 flex justify-between">
                  <span className="text-slate-400">Access</span> 
                  <span className="font-medium text-brand-blue">{selectedAdmin.role === "admin" ? "Super Admin" : selectedAdmin.adminRole?.name || "Staff"}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold mb-3">Rotate Password</h4>
                {changePasswordFor === selectedAdmin.id ? (
                  <div className="grid gap-3">
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="h-11 rounded-xl"
                      value={passwordDrafts[selectedAdmin.id] ?? ""}
                      onChange={(event) => setPasswordDrafts((current) => ({ ...current, [selectedAdmin.id]: event.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={updatePassword.isPending || (passwordDrafts[selectedAdmin.id] ?? "").length < 8}
                        className="rounded-full bg-brand-blue text-white hover:bg-brand-dark flex-1"
                        onClick={() => updatePassword.mutate({ id: selectedAdmin.id, password: passwordDrafts[selectedAdmin.id] ?? "" })}
                      >
                        Confirm
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => { setChangePasswordFor(null); setPasswordDrafts((c) => ({ ...c, [selectedAdmin.id]: "" })); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" className="w-full rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setChangePasswordFor(selectedAdmin.id)}>
                    <KeyRound size={16} className="mr-2" />
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
