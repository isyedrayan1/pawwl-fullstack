import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "pawwl_session",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-session-secret-change-me",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:8080",
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  gmailUser: process.env.GMAIL_USER,
  resetPasswordTtlMinutes: Number(process.env.RESET_PASSWORD_TTL_MINUTES ?? 20),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
};

export const isProduction = env.nodeEnv === "production";
