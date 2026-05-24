import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AccountLayout from "@/components/AccountLayout";
import { apiRequest, ApiUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, User } from "lucide-react";

const AccountProfile = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: ApiUser }>("/api/auth/me"),
    retry: false,
  });

  const [formData, setFormData] = useState({
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    phone: data?.user?.phone || "",
  });

  React.useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify(formData),
      }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="text-center py-12">
          <p className="text-[#666]">Loading profile...</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Profile Settings</h1>
          <p className="text-[#666] mt-1">Update your personal information</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-border-design rounded-xl p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <User size={18} />
                Full Name
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-design rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                Email Address
              </div>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-border-design rounded-lg bg-gray-50 text-[#999] cursor-not-allowed"
              placeholder="Email cannot be changed"
            />
            <p className="text-xs text-[#999] mt-2">Email address cannot be changed for security reasons</p>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-2">
              <div className="flex items-center gap-2">
                <Phone size={18} />
                Phone Number
              </div>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-design rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border-design">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-brand-blue"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: data?.user?.name || "",
                  email: data?.user?.email || "",
                  phone: data?.user?.phone || "",
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Account Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-brand-dark mb-3">Account Information</h3>
          <div className="space-y-2 text-sm">
            <p className="text-[#666]">
              <strong>Account Status:</strong>{" "}
              <span className="text-green-600 font-semibold">Active</span>
            </p>
            <p className="text-[#666]">
              <strong>Member Since:</strong>{" "}
              {data?.user?.createdAt
                ? new Date(data.user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-[#666]">
              <strong>Account Role:</strong>{" "}
              <span className="capitalize">{data?.user?.role || "User"}</span>
            </p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountProfile;
