import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { asyncHandler } from "../lib/async.js";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/http.js";
import { sendPasswordResetEmail } from "../lib/mailer.js";
import { prisma } from "../lib/prisma.js";
import {
  clearSessionCookie,
  createSession,
  destroyCurrentSession,
  requireAuth,
  setSessionCookie,
} from "../middleware/auth.js";

const router = Router();

const hashPasswordFingerprint = (passwordHash: string) =>
  crypto.createHash("sha256").update(passwordHash).digest("hex");

const createResetToken = (userId: string, passwordHash: string) => {
  const payload = {
    userId,
    passwordFingerprint: hashPasswordFingerprint(passwordHash),
    exp: Date.now() + env.resetPasswordTtlMinutes * 60 * 1000,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", env.sessionSecret).update(encodedPayload).digest("base64url");

  return `${encodedPayload}.${signature}`;
};

const verifyResetToken = (token: string): { userId: string; passwordFingerprint: string; exp: number } => {
  const parts = token.split(".");
  if (parts.length !== 2) throw new HttpError(400, "Invalid or expired reset token");

  const [encodedPayload, signature] = parts;
  const expected = crypto.createHmac("sha256", env.sessionSecret).update(encodedPayload).digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  let payload: { userId: string; passwordFingerprint: string; exp: number };
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  if (!payload.userId || !payload.passwordFingerprint || !payload.exp || payload.exp <= Date.now()) {
    throw new HttpError(400, "Invalid or expired reset token");
  }

  return payload;
};

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

const forgotPasswordSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8),
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
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new HttpError(409, "Email is already registered");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        id: createId(),
        name: input.name,
        username: input.username?.trim() || null,
        email: input.email,
        passwordHash,
        role: "customer",
      },
      select: publicUser,
    });

    const session = await createSession(user.id);
    setSessionCookie(res, session.token, session.expiresAt);
    res.status(201).json({ user });
  }),
);

router.post(
  "/login",
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

    const session = await createSession(user.id);
    setSessionCookie(res, session.token, session.expiresAt);
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
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const input = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (user && user.status === "active") {
      const token = createResetToken(user.id, user.passwordHash);
      const resetLink = `${env.frontendOrigin}/reset-password?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail(user.email, resetLink);
    }

    res.json({
      ok: true,
      message: "If an account exists for this email, a password reset link has been sent.",
    });
  }),
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const input = resetPasswordSchema.parse(req.body);
    const payload = verifyResetToken(input.token);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.status !== "active") throw new HttpError(400, "Invalid or expired reset token");

    const currentFingerprint = hashPasswordFingerprint(user.passwordHash);
    if (currentFingerprint !== payload.passwordFingerprint) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    const newHash = await bcrypt.hash(input.newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);

    clearSessionCookie(res);
    res.json({ ok: true });
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
  res.json({ user: req.user });
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

router.post(
  "/me/password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = z
      .object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) })
      .parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new HttpError(404, "User not found");

    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw new HttpError(401, "Current password is incorrect");

    const newHash = await bcrypt.hash(input.newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    res.json({ ok: true });
  }),
);

export default router;
