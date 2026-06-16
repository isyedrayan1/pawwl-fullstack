import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/addresses.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payments.js";
import webhookRoutes from "./routes/webhooks.js";
import leadsRoutes from "./routes/leads.js";
import { env, isProduction } from "./lib/env.js";
import { optionalAuth, optionalAdminAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(optionalAuth);
app.use(optionalAdminAuth);

// Statically serve uploaded product images
const isDist = __dirname.includes(path.join('dist', 'src')) || __dirname.includes('dist/src') || __dirname.includes('dist\\src');
const uploadsDir = isDist 
  ? path.resolve(__dirname, '../../uploads')
  : path.resolve(__dirname, '../uploads');
app.use("/uploads", express.static(uploadsDir));

const productsDir = isDist
  ? path.resolve(__dirname, '../../products')
  : path.resolve(__dirname, '../products');
app.use("/products", express.static(productsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pawwl-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/leads", leadsRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

if (isProduction) {
  const frontendDist = path.resolve(__dirname, "../../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(errorHandler);

// Hostinger uses Phusion Passenger which handles port binding internally.
// We must NOT call app.listen() in production — just export the app.
// For local development, we call app.listen() normally.
if (!isProduction) {
  const devPort = Number(process.env.PORT) || 4000;
  app.listen(devPort, () => {
    console.log(`Pawwl API listening on port ${devPort} (dev mode)`);
  });
} else {
  console.log("[server] Production mode — Express app exported for Passenger");
}

export default app;
