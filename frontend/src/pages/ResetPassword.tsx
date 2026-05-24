import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiRequest<{ ok: true }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-16 max-w-xl">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-3">Reset Password</h1>
        <p className="text-brand-accent mb-8">Set a new password for your account.</p>

        {!token ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Invalid reset link. Please request a new one from the forgot password page.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="New password (minimum 8 characters)"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
            />
            <Button disabled={loading} className="h-12 bg-brand-blue hover:bg-brand-dark">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}

        <p className="text-sm text-[#555] mt-6">
          Back to <Link to="/login" className="font-bold text-brand-blue">Login</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
