import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { adminPath } from "@/lib/routes";
import { Helmet } from "react-helmet-async";

const AdminLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () =>
      apiRequest("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ identifier: email, password }),
      }),
    onSuccess: () => {
      toast.success("Welcome back to the Admin Console");
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      navigate(adminPath("/"));
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Invalid credentials or unauthorized");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    login.mutate();
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal | Pawwl</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(19,78,134,0.12),_rgba(255,255,255,0)_40%),linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[2.5rem] border border-border-design bg-white p-8 shadow-xl sm:p-12">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-dark text-white">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">Admin Portal</h1>
            <p className="mt-2 text-sm text-[#666]">Sign in with your staff account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-brand-dark">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@pawwl.com"
                  className="h-12 rounded-xl border-border-design px-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={login.isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-brand-dark">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-border-design px-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={login.isPending}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-brand-blue text-base font-medium text-white hover:bg-brand-dark disabled:opacity-70"
              disabled={login.isPending}
            >
              {login.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign in to console"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-[#666]">
            <Link to="/" className="text-brand-blue hover:underline">
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
