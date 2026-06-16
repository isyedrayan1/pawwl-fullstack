import { FormEvent, useState } from "react";
import { ApiAddress } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/api";
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

type AddressDraft = Omit<ApiAddress, "id">;

const emptyAddress: AddressDraft = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Maharashtra",
  postalCode: "",
  country: "India",
  isDefault: true,
};

type AddressSelectorProps = {
  open: boolean;
  addresses: ApiAddress[];
  selectedAddressId?: string;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (addressId: string) => void;
  onCreate: (address: AddressDraft) => void;
};

const AddressSelector = ({
  open,
  addresses,
  selectedAddressId,
  saving,
  onOpenChange,
  onSelect,
  onCreate,
}: AddressSelectorProps) => {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [draft, setDraft] = useState<AddressDraft>(emptyAddress);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const resolvePostalCode = async () => {
    const pin = (draft.postalCode ?? "").trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      setPincodeError("Enter a valid 6-digit PIN code");
      return;
    }

    try {
      const response = await apiRequest<{ resolvedState: string }>(`/api/addresses/resolve-postal-code/${pin}`);
      setDraft((current) => ({
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

  const submitAddress = (event: FormEvent) => {
    event.preventDefault();
    onCreate(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Delivery address</DialogTitle>
          <DialogDescription>Choose where this order should be shipped.</DialogDescription>
        </DialogHeader>

        {addresses.length > 0 && !showForm && (
          <div className="space-y-4">
            <RadioGroup value={selectedAddressId} onValueChange={onSelect} className="gap-3">
              {addresses.map((address) => (
                <Label
                  key={address.id}
                  htmlFor={address.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-design p-4"
                >
                  <RadioGroupItem id={address.id} value={address.id} className="mt-1" />
                  <span className="grid gap-1 text-sm leading-relaxed">
                    <span className="font-bold text-brand-dark">
                      {address.label ?? "Address"} {address.isDefault ? "Default" : ""}
                    </span>
                    <span>{address.fullName}, {address.phone}</span>
                    <span className="text-[#555]">
                      {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.postalCode}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
            <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
              Add new address
            </Button>
          </div>
        )}

        {(showForm || addresses.length === 0) && (
          <form onSubmit={submitAddress} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Label" value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              <Input placeholder="Full name" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} required />
            </div>
            <Input placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} required />
            <Input placeholder="Address line 1" value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} required />
            <Input placeholder="Address line 2" value={draft.line2 ?? ""} onChange={(e) => setDraft({ ...draft, line2: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} required />
              <div>
                <Input
                  placeholder="Pincode"
                  value={draft.postalCode}
                  onChange={(e) => {
                    setDraft({ ...draft, postalCode: e.target.value });
                    setPincodeError(null);
                  }}
                  onBlur={resolvePostalCode}
                  maxLength={6}
                  required
                />
                {pincodeError && <p className="text-xs text-red-600 mt-1">{pincodeError}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <select
                  aria-label="Country or region"
                  value={draft.country ?? "India"}
                  onChange={() => setDraft((current) => ({ ...current, country: "India" }))}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="India">India</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              </div>
              <div className="relative">
                <select
                  aria-label="State or province"
                  value={draft.state ?? ""}
                  onChange={(e) => setDraft((current) => ({ ...current, state: e.target.value }))}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select state</option>
                  {INDIA_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {addresses.length > 0 && (
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="sm:w-32">
                  Back
                </Button>
              )}
              <Button disabled={saving} className="flex-1 bg-brand-blue hover:bg-brand-dark">
                {saving ? "Saving..." : "Save address"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressSelector;
