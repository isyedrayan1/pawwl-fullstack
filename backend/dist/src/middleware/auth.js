import crypto from "crypto";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../lib/prisma.js";
import { env, isProduction } from "../lib/env.js";
import { HttpError } from "../lib/http.js";
const hashToken = (token) => crypto.createHmac("sha256", env.sessionSecret).update(token).digest("hex");
export const createSession = async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.create({
        data: { id: createId(), userId, tokenHash, expiresAt },
    });
    return { token, expiresAt };
};
export const setSessionCookie = (res, token, expiresAt) => {
    res.cookie(env.sessionCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        expires: expiresAt,
        path: "/",
    });
};
export const clearSessionCookie = (res) => {
    res.clearCookie(env.sessionCookieName, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        path: "/",
    });
};
export const setAdminSessionCookie = (res, token, expiresAt) => {
    res.cookie("admin_session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        expires: expiresAt,
        path: "/",
    });
};
export const clearAdminSessionCookie = (res) => {
    res.clearCookie("admin_session", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        path: "/",
    });
};
export const optionalAuth = async (req, _res, next) => {
    const token = req.cookies?.[env.sessionCookieName];
    if (!token)
        return next();
    const session = await prisma.session.findUnique({
        where: { tokenHash: hashToken(token) },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true, status: true, phone: true, walletBalance: true, adminRoleId: true },
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
export const requireAuth = (req, _res, next) => {
    if (!req.user)
        return next(new HttpError(401, "Authentication required"));
    next();
};
export const optionalAdminAuth = async (req, _res, next) => {
    const token = req.cookies?.["admin_session"];
    if (!token)
        return next();
    const session = await prisma.session.findUnique({
        where: { tokenHash: hashToken(token) },
        include: {
            user: {
                select: {
                    id: true, name: true, email: true, role: true, status: true, adminRoleId: true,
                    adminRole: { select: { permissions: true } }
                },
            },
        },
    });
    if (!session || session.expiresAt <= new Date() || session.user.status !== "active") {
        return next();
    }
    req.adminUser = session.user;
    req.adminSessionId = session.id;
    next();
};
export const requireAdmin = (req, _res, next) => {
    if (!req.adminUser)
        return next(new HttpError(401, "Admin authentication required"));
    if (req.adminUser.role === "admin")
        return next(); // Super admin bypass
    if (req.adminUser.role === "customer" && !req.adminUser.adminRoleId)
        return next(new HttpError(403, "Admin access required"));
    // Valid roles: admin, marketing, fulfillment, or any custom role mapped to adminRole
    if (req.adminUser.role === "customer" && req.adminUser.adminRoleId)
        return next();
    if (["fulfillment", "marketing"].includes(req.adminUser.role))
        return next();
    next(new HttpError(403, "Admin access required"));
};
export const requireSuperAdmin = (req, _res, next) => {
    if (!req.adminUser)
        return next(new HttpError(401, "Admin authentication required"));
    if (req.adminUser.role !== "admin")
        return next(new HttpError(403, "Super Admin access required"));
    next();
};
export const requireScope = (scope) => {
    return (req, _res, next) => {
        if (!req.adminUser)
            return next(new HttpError(401, "Admin authentication required"));
        if (req.adminUser.role === "admin")
            return next(); // Super admin bypass
        // Check if dynamic role has permission
        if (req.adminUser.adminRole?.permissions) {
            const perms = req.adminUser.adminRole.permissions.split(",");
            if (perms.includes(scope) || perms.includes("*")) {
                return next();
            }
        }
        // Fallback for hardcoded roles
        if (req.adminUser.role === "marketing" && ["manage_products", "manage_coupons", "manage_reviews"].includes(scope))
            return next();
        if (req.adminUser.role === "fulfillment" && ["manage_orders", "manage_returns"].includes(scope))
            return next();
        next(new HttpError(403, `Missing required scope: ${scope}`));
    };
};
export const destroyCurrentSession = async (req) => {
    const token = req.cookies?.[env.sessionCookieName];
    if (token) {
        await prisma.session.deleteMany({
            where: { tokenHash: hashToken(token) },
        });
    }
};
export const destroyAdminSession = async (req) => {
    const token = req.cookies?.["admin_session"];
    if (token) {
        await prisma.session.deleteMany({
            where: { tokenHash: hashToken(token) },
        });
    }
};
