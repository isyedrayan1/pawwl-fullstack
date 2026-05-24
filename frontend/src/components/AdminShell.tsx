import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Menu, Package, ReceiptText, Shield, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiUser } from "@/lib/api";
import { adminPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: adminPath("/"), icon: LayoutDashboard },
  { label: "Products", href: adminPath("/products"), icon: Package },
  { label: "Orders", href: adminPath("/orders"), icon: ReceiptText },
  { label: "Users", href: adminPath("/users"), icon: Users },
  { label: "Admins", href: adminPath("/admins"), icon: Shield },
];

type AdminShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const AdminShell = ({ title, description, actions, children }: AdminShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const auth = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: ApiUser }>("/api/auth/me"),
    retry: false,
  });

  const currentUser = auth.data?.user;
  const isAdmin = currentUser?.role === "admin";

  const activeNav = useMemo(() => navItems.find((item) => location.pathname === item.href), [location.pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    try {
      window.dispatchEvent(new Event("pawwl:auth-changed"));
    } catch {
      // ignore
    }
    navigate("/login");
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,95,140,0.08),_rgba(255,255,255,0)_35%),linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_100%)]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-[2rem] border border-border-design bg-white px-6 py-5 text-sm text-[#666] shadow-sm">
            Checking admin session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(19,78,134,0.12),_rgba(255,255,255,0)_40%),linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_100%)] px-4 py-10 text-brand-dark sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-border-design bg-white p-6 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">Admin access</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sign in with an admin account</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#666]">
              The admin workspace is protected. Use an account with the admin role to continue.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-brand-blue px-5 text-white hover:bg-brand-dark">
                <Link to="/login">Go to login</Link>
              </Button>
              <Button variant="outline" className="rounded-full border-border-design bg-white text-brand-dark hover:bg-brand-light" onClick={() => navigate(0)}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(19,78,134,0.08),_rgba(255,255,255,0)_34%),linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_100%)] text-brand-dark">
      <div className="mx-auto grid min-h-screen max-w-[1680px] lg:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen flex-col border-r border-border-design bg-brand-dark px-5 py-6 text-white lg:flex">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">Admin Console</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Pawwl</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Clean control for catalog, orders, users, and admin operations.
            </p>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active ? "bg-white text-brand-dark" : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="font-medium text-white">Signed in as</p>
            <p className="mt-1 break-all text-white/85">{currentUser?.name}</p>
            <p className="mt-1 text-xs text-white/55">{currentUser?.username ?? currentUser?.email}</p>
          </div>

          <Button
            variant="outline"
            className="mt-4 rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-border-design bg-white/90 backdrop-blur-xl">
            {/* Mobile header: compact with hamburger on left and logo */}
            <div className="flex items-center gap-3 px-4 py-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen((value) => !value)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-design bg-white text-brand-dark"
                aria-label="Toggle admin navigation"
              >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="text-sm font-bold text-brand-dark">Pawwl Admin</div>
            </div>

            {/* Desktop header: full info (hidden on mobile) */}
            <div className="hidden items-center gap-3 px-6 py-4 lg:flex lg:px-8">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">Admin</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                  {activeNav && (
                    <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                      {activeNav.label}
                    </span>
                  )}
                </div>
                {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#666]">{description}</p>}
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full border border-border-design bg-brand-light px-4 py-2 text-sm font-medium text-brand-dark">
                  {currentUser?.username ?? currentUser?.email}
                </div>
                <Button variant="outline" className="rounded-full border-border-design bg-white text-brand-dark hover:bg-brand-light" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile top nav removed: rely on hamburger sidebar for navigation on mobile */}
          </header>

          <main className="px-3 py-4 sm:px-6 lg:px-8 xl:px-10">{children}</main>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-border-design bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">Admin Console</p>
                <p className="mt-1 text-lg font-bold text-brand-dark">Pawwl</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border-design bg-white text-brand-dark"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      active ? "bg-brand-blue text-white" : "bg-brand-light/70 text-brand-dark hover:bg-brand-light",
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-[1.5rem] border border-border-design bg-brand-light p-4">
              <p className="text-sm font-medium text-brand-dark">{currentUser?.name}</p>
              <p className="mt-1 text-xs text-[#666]">{currentUser?.username ?? currentUser?.email}</p>
            </div>

            <Button className="mt-4 w-full rounded-full bg-brand-blue text-white hover:bg-brand-dark" onClick={logout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShell;
