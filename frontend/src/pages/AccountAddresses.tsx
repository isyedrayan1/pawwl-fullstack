import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AccountLayout from "@/components/AccountLayout";
import { apiRequest, ApiAddress } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Edit2, Plus, MapPin, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AccountAddresses = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () =>
      apiRequest<{ addresses: ApiAddress[] }>("/api/addresses"),
    retry: false,
  });

  const addresses = data?.addresses ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Address deleted");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to delete address");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDefault: true }),
      }),
    onSuccess: () => {
      toast.success("Default address updated");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to update address");
    },
  });

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">My Addresses</h1>
            <p className="text-[#666] mt-1">Manage your delivery addresses</p>
          </div>
          <Link to="/account/addresses/new">
            <Button className="bg-brand-blue flex items-center gap-2">
              <Plus size={18} />
              Add New Address
            </Button>
          </Link>
        </div>

        {/* Addresses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#666]">Loading your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-border-design">
            <MapPin size={48} className="mx-auto text-[#ccc] mb-4" />
            <p className="text-[#666] text-lg mb-6">
              You haven't saved any addresses yet.
            </p>
            <Link to="/account/addresses/new">
              <Button className="bg-brand-blue">
                <Plus size={18} className="mr-2" />
                Add Your First Address
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative bg-white border border-border-design rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <CheckCircle size={14} />
                      Default
                    </div>
                  </div>
                )}

                {/* Address Info */}
                <div className="pr-24">
                  <h3 className="text-lg font-bold text-brand-dark">
                    {address.fullName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-[#666]">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-brand-blue mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-brand-blue flex-shrink-0" />
                      <span>{address.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 pt-6 border-t border-border-design">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      disabled={setDefaultMutation.isPending}
                      className="flex-1"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Link to={`/account/addresses/edit/${address.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(address.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountAddresses;
