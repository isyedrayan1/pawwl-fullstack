import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiAddress } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const emptyAddress: Partial<ApiAddress> = {
  label: "home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const splitFullName = (fullName?: string | null) => {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0] ?? "", lastName: "" };
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

const AccountAddressForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["addresses", id],
    queryFn: () => apiRequest<{ address: ApiAddress }>(`/api/addresses/${id}`),
    enabled: isEdit,
    retry: false,
  });

  const [form, setForm] = useState<Partial<ApiAddress>>(emptyAddress);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && data?.address) {
      const address = data.address as ApiAddress;
      setForm(address);
      const splitName = splitFullName(address.fullName);
      setFirstName(splitName.firstName);
      setLastName(splitName.lastName);
    }
  }, [isEdit, data]);

  const createMut = useMutation({
    mutationFn: (payload: Partial<ApiAddress>) =>
      apiRequest(`/api/addresses`, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success("Address added");
      qc.invalidateQueries({ queryKey: ["addresses"] });
      navigate("/account/addresses");
    },
    onError: () => toast.error("Failed to add address"),
  });

  const updateMut = useMutation({
    mutationFn: (payload: Partial<ApiAddress>) =>
      apiRequest(`/api/addresses/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success("Address updated");
      qc.invalidateQueries({ queryKey: ["addresses"] });
      navigate("/account/addresses");
    },
    onError: () => toast.error("Failed to update address"),
  });

  const handleChange = (k: keyof ApiAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target.type === "checkbox") ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((s) => ({ ...s, [k]: value }));
    if (k === "postalCode") {
      setPincodeError(null);
    }
  };

  const resolvePostalCode = async () => {
    const pin = (form.postalCode ?? "").trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      setPincodeError("Enter a valid 6-digit PIN code");
      return;
    }

    try {
      const response = await apiRequest<{ resolvedState: string }>(`/api/addresses/resolve-postal-code/${pin}`);
      setForm((current) => ({
        ...current,
        state: response.resolvedState,
      }));
      setPincodeError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "PIN code could not be verified";
      setPincodeError(message);
      toast.error(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    const payload = {
      ...form,
      label: form.label === "work" ? "work" : "home",
      fullName,
      country: "India",
    } as Partial<ApiAddress>;
    if (isEdit) updateMut.mutate(payload);
    else createMut.mutate(payload);
  };

  return (
    <AccountLayout>
      <div className="max-w-4xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-brand-dark">{isEdit ? "Edit Address" : "Create Address"}</h1>
          <p className="mt-1 text-sm text-[#666]">Manual city/town, India only, and PIN just helps with state.</p>
        </div>
        {isEdit && isLoading ? (
          <p>Loading address...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white border border-border-design rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-base font-semibold text-brand-dark">Address Type</h2>
                  <p className="text-sm text-[#666]">Choose how you use this address.</p>
                </div>
                <div className="flex items-center gap-5 text-sm font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="label" checked={(form.label ?? "home") === "home"} onChange={() => setForm((s) => ({ ...s, label: "home" }))} />
                    Home
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="label" checked={form.label === "work"} onChange={() => setForm((s) => ({ ...s, label: "work" }))} />
                    Work
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-[#667] mb-2 block">First Name</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="rounded-xl bg-white" />
                </div>
                <div>
                  <label className="text-sm text-[#667] mb-2 block">Last Name</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="rounded-xl bg-white" />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm text-[#667] mb-2 block">Address line 1</label>
                <Input value={form.line1 ?? ""} onChange={handleChange("line1")} placeholder="House number, building, street" className="rounded-xl bg-white" />
              </div>

              <div className="mt-3">
                <label className="text-sm text-[#667] mb-2 block">Address line 2 (optional)</label>
                <Input value={form.line2 ?? ""} onChange={handleChange("line2")} placeholder="Apartment, floor, landmark" className="rounded-xl bg-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="relative">
                  <label className="text-sm text-[#667] mb-2 block">City / Town</label>
                  <Input value={form.city ?? ""} onChange={handleChange("city")} placeholder="City / Town" className="rounded-xl bg-white" />
                </div>
                <div className="relative">
                  <label className="text-sm text-[#667] mb-2 block">Post Code</label>
                  <Input
                    value={form.postalCode ?? ""}
                    onChange={handleChange("postalCode")}
                    placeholder="6-digit PIN"
                    className="rounded-xl bg-white"
                    maxLength={6}
                    onBlur={resolvePostalCode}
                  />
                  {pincodeError && <p className="text-xs text-red-600 mt-1">{pincodeError}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-sm text-[#667] mb-2 block">Country/Region</label>
                  <div className="relative">
                    <select
                      aria-label="Country or region"
                      value={form.country ?? "India"}
                      onChange={() => setForm((current) => ({ ...current, country: "India" }))}
                      className="h-11 w-full appearance-none rounded-xl border border-input bg-white px-3 pr-10 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="India">India</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#667] mb-2 block">State/Province</label>
                  <div className="relative">
                    <select
                      aria-label="State or province"
                      value={form.state ?? ""}
                      onChange={(e) => setForm((current) => ({ ...current, state: e.target.value }))}
                      className="h-11 w-full appearance-none rounded-xl border border-input bg-white px-3 pr-10 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select state</option>
                      {INDIA_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm text-[#667] mb-2 block">Phone</label>
                <Input value={form.phone ?? ""} onChange={handleChange("phone")} placeholder="Phone" className="rounded-xl bg-white" />
              </div>

              <div className="flex items-center gap-3 mt-5">
                <Checkbox id="isDefault" checked={!!form.isDefault} onCheckedChange={(val) => setForm(s => ({ ...s, isDefault: !!val }))} />
                <label htmlFor="isDefault" className="text-sm text-[#666]">Set as default address</label>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="submit" className="bg-brand-blue px-6 py-3 rounded-xl">{isEdit ? "Save Address" : "Add Address"}</Button>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountAddressForm;
