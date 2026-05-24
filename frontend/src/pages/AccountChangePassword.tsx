import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AccountLayout from "@/components/AccountLayout";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const AccountChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/auth/me/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      }),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to change password");
      setErrors({ submit: error?.message || "An error occurred" });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate();
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Change Password</h1>
          <p className="text-[#666] mt-1">Update your account password</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-border-design rounded-xl p-8 space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <Lock size={18} />
                Current Password
              </div>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.currentPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-border-design focus:ring-brand-blue"
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                }
                className="absolute right-4 top-3 text-[#666] hover:text-brand-dark"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-600 text-sm mt-2">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <Lock size={18} />
                New Password
              </div>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-border-design focus:ring-brand-blue"
                }`}
                placeholder="Enter a new password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-4 top-3 text-[#666] hover:text-brand-dark"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-2">{errors.newPassword}</p>
            )}
            {/* Password strength indicator */}
            {formData.newPassword && !errors.newPassword && (
              <div className="mt-2">
                <div className="h-2 bg-border-design rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      formData.newPassword.length >= 12
                        ? "bg-green-500 w-full"
                        : formData.newPassword.length >= 10
                        ? "bg-yellow-500 w-2/3"
                        : "bg-blue-500 w-1/3"
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-[#666] mt-1">
                  {formData.newPassword.length >= 12
                    ? "Strong password"
                    : formData.newPassword.length >= 10
                    ? "Good password"
                    : "Fair password"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <Lock size={18} />
                Confirm New Password
              </div>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-border-design focus:ring-brand-blue"
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                }
                className="absolute right-4 top-3 text-[#666] hover:text-brand-dark"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-2">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border-design">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-brand-blue"
            >
              {updateMutation.isPending ? "Updating..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-brand-dark mb-3">Password Tips</h3>
          <ul className="space-y-2 text-sm text-[#666]">
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              Use at least 8 characters
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              Mix uppercase and lowercase letters
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              Include numbers and special characters
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              Avoid using personal information
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
              Don't reuse passwords from other accounts
            </li>
          </ul>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountChangePassword;
