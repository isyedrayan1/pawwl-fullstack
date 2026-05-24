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
            <div className="grid gap-4 sm:grid-cols-3">
              <Input placeholder="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} required />
              <Input placeholder="State" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} required />
              <Input placeholder="Pincode" value={draft.postalCode} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} required />
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
