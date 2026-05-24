import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest<{ ok: true; message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("If the email exists, we sent a reset link.");
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-16 max-w-xl">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-3">Forgot Password</h1>
        <p className="text-brand-accent mb-8">Enter your email and we will send a reset link.</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button disabled={loading} className="h-12 bg-brand-blue hover:bg-brand-dark">
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-sm text-[#555] mt-6">
          Back to <Link to="/login" className="font-bold text-brand-blue">Login</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
