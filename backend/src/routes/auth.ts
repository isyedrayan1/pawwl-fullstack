import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { asyncHandler } from "../lib/async.js";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import {
  clearSessionCookie,
  createSession,
  destroyCurrentSession,
  requireAuth,
  setSessionCookie,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  destroyAdminSession,
  requireAdmin,
} from "../middleware/auth.js";

import { auth } from "../lib/firebase-admin.js";

const router = Router();



const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).optional(),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

const loginSchema = z.object({
  identifier: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
});



const publicUser = {
  id: true,
  name: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  walletBalance: true,
  createdAt: true,
} as const;

router.post(
  "/firebase-login",
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) throw new HttpError(400, "Missing idToken");

    // Verify token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;
    if (!email) throw new HttpError(400, "Email is required from Firebase");

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: createId(),
          name: name || email.split("@")[0],
          username: email.split("@")[0],
          email: email,
          passwordHash: "firebase", // Not used since we rely on Firebase
          role: "customer",
        },
      });
    }

    if (user.status !== "active") throw new HttpError(401, "Account disabled");

    // Create custom session cookie so existing backend logic works identically
    const session = await createSession(user.id);
    setSessionCookie(res, session.token, session.expiresAt);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  }),
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await destroyCurrentSession(req);
    clearSessionCookie(res);
    res.json({ ok: true });
  }),
);

router.get("/me", requireAuth, (req, res) => {
  const adminRoles = ["admin", "fulfillment", "marketing"];
  if (adminRoles.includes(req.user!.role)) {
    // If an admin somehow has a consumer session, clear it.
    clearSessionCookie(res);
    return res.status(401).json({ error: "Staff must use the Admin Portal" });
  }
  res.json({ user: req.user });
});

router.post(
  "/admin/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const identifier = (input.identifier ?? input.email ?? "").trim().toLowerCase();
    if (!identifier) throw new HttpError(400, "Email or username is required");
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user || user.status !== "active") throw new HttpError(401, "Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new HttpError(401, "Invalid email or password");

    const adminRoles = ["admin", "fulfillment", "marketing"];
    if (!adminRoles.includes(user.role)) {
      throw new HttpError(403, "Not authorized to access the admin portal");
    }

    const session = await createSession(user.id);
    setAdminSessionCookie(res, session.token, session.expiresAt);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  }),
);

router.post(
  "/admin/logout",
  asyncHandler(async (req, res) => {
    await destroyAdminSession(req);
    clearAdminSessionCookie(res);
    res.json({ ok: true });
  }),
);

router.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ user: req.adminUser });
});

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = z
      .object({ name: z.string().min(2).optional(), phone: z.string().min(6).optional() })
      .parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: input,
      select: { id: true, name: true, username: true, email: true, role: true, status: true, phone: true, walletBalance: true },
    });

    res.json({ user });
  }),
);



export default router;
