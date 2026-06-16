import React, { useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail } from "lucide-react";

const AccountChangePassword = () => {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const isPassword = user.providerData.some((p) => p.providerId === "password");
      setHasPassword(isPassword);
    }
  }, [auth.currentUser]);

  const handleSendResetEmail = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error("You must be logged in to change your password.");
      return;
    }

    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Change Password</h1>
          <p className="text-[#666] mt-1">Update your account password</p>
        </div>

        {hasPassword === false ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-brand-dark mb-2">Google Sign-In Account</h2>
            <p className="text-[#666]">
              You logged into Pawwl using Google. Your password is securely managed by Google, so you cannot change it here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-border-design rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-brand-blue" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark">Reset Your Password</h2>
            <p className="text-[#666] max-w-md mx-auto">
              We'll send a secure password reset link directly to your email address. You can use this link to choose a new password.
            </p>
            <div className="pt-4">
              <Button 
                onClick={handleSendResetEmail} 
                disabled={isSending}
                className="bg-brand-blue w-full sm:w-auto px-8"
              >
                {isSending ? "Sending..." : "Send Password Reset Email"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountChangePassword;
