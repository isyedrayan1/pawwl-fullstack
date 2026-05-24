import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { adminPath, isAdminHost } from "@/lib/routes";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest<{ user: { role: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: email, password }),
      });
      toast.success("Logged in");
      if (data.user.role === "admin") {
        navigate(isAdminHost() ? "/" : adminPath("/"));
      } else {
        navigate("/account");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-16 max-w-xl">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-3">Login</h1>
        <p className="text-brand-accent mb-8">Access your orders, addresses, and checkout.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input type="text" placeholder="Email or username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="text-right text-sm">
            <Link to="/forgot-password" className="font-semibold text-brand-blue hover:text-brand-dark">
              Forgot password?
            </Link>
          </div>
          <Button disabled={loading} className="h-12 bg-brand-blue hover:bg-brand-dark">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-[#555] mt-6">
          New here? <Link to="/register" className="font-bold text-brand-blue">Create an account</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
