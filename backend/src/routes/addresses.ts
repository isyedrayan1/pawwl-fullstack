import { Router } from "express";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();



const resolvePostalCode = async (postalCode: string) => {
  const pin = postalCode.trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new HttpError(400, "Enter a valid 6-digit PIN code");
  }

  const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
  if (!response.ok) {
    throw new HttpError(400, "PIN code could not be verified");
  }

  const data = await response.json().catch(() => null);
  const entry = Array.isArray(data) ? data[0] : null;
  const firstPostOffice = Array.isArray(entry?.PostOffice) ? entry.PostOffice[0] : null;

  if (!entry || entry.Status !== "Success" || !firstPostOffice?.State) {
    throw new HttpError(400, "PIN code not found");
  }

  return {
    resolvedState: String(firstPostOffice.State),
    district: firstPostOffice.District ? String(firstPostOffice.District) : undefined,
  };
};

const addressSchema = z.object({
  label: z.string().default("home"),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

router.use(requireAuth);

router.get(
  "/resolve-postal-code/:postalCode",
  asyncHandler(async (req, res) => {
    const resolved = await resolvePostalCode(String(req.params.postalCode));
    res.json(resolved);
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    res.json({ addresses });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = addressSchema.parse(req.body);
    const resolvedPostalCode = await resolvePostalCode(input.postalCode);
    if (input.state.trim() && input.state.trim() !== resolvedPostalCode.resolvedState) {
      throw new HttpError(400, `State does not match PIN code (${resolvedPostalCode.resolvedState})`);
    }
    const state = input.state.trim() || resolvedPostalCode.resolvedState;
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { id: createId(), ...input, state, label: input.label, userId: req.user!.id },
    });
    res.status(201).json({ address });
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = addressSchema.partial().parse(req.body);
    const addressId = String(req.params.id);
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: req.user!.id },
    });
    if (!existing) throw new HttpError(404, "Address not found");

    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    let nextState = input.state;
    if (input.postalCode) {
      const resolvedPostalCode = await resolvePostalCode(input.postalCode);
      if (input.state?.trim() && input.state.trim() !== resolvedPostalCode.resolvedState) {
        throw new HttpError(400, `State does not match PIN code (${resolvedPostalCode.resolvedState})`);
      }
      nextState = input.state?.trim() || resolvedPostalCode.resolvedState;
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...input,
        ...(nextState ? { state: nextState } : {}),
        ...(input.label ? { label: input.label } : {}),
      },
    });
    res.json({ address });
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const addressId = String(req.params.id);
    await prisma.address.deleteMany({
      where: { id: addressId, userId: req.user!.id },
    });
    res.json({ ok: true });
  }),
);

export default router;
