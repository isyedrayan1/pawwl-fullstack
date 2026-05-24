import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      toast.success("Account created");
      navigate("/account");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-16 max-w-xl">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-3">Create Account</h1>
        <p className="text-brand-accent mb-8">Save addresses and track Pawwl orders.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password, minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <Button disabled={loading} className="h-12 bg-brand-blue hover:bg-brand-dark">
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <p className="text-sm text-[#555] mt-6">
          Already have an account? <Link to="/login" className="font-bold text-brand-blue">Login</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
