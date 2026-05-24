import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import type { user as PrismaUser } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../lib/prisma.js";
import { env, isProduction } from "../lib/env.js";
import { HttpError } from "../lib/http.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<PrismaUser, "id" | "name" | "email" | "role" | "status">;
      sessionId?: string;
    }
  }
}

const hashToken = (token: string) =>
  crypto.createHmac("sha256", env.sessionSecret).update(token).digest("hex");

export const createSession = async (userId: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.session.create({
    data: { id: createId(), userId, tokenHash, expiresAt },
  });

  return { token, expiresAt };
};

export const setSessionCookie = (res: Response, token: string, expiresAt: Date) => {
  res.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    expires: expiresAt,
    path: "/",
  });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
  });
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) return next();

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true, status: true, phone: true, walletBalance: true },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== "active") {
    return next();
  }

  req.user = session.user;
  req.sessionId = session.id;
  next();
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new HttpError(401, "Authentication required"));
  next();
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new HttpError(401, "Authentication required"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Admin access required"));
  next();
};

export const destroyCurrentSession = async (req: Request) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) return;

  await prisma.session.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
};
