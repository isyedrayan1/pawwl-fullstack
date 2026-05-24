import { env } from "./env.js";

const postJson = async (url: string, body: unknown, headers: Record<string, string>) => {
  const fetchFn = (globalThis as any).fetch as
    | ((input: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<any>)
    | undefined;

  if (!fetchFn) {
    throw new Error("Fetch API is not available in this Node runtime");
  }

  return fetchFn(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  if (!env.resendApiKey || !env.resendFromEmail) {
    console.warn("[auth] Password reset email provider not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
    console.info(`[auth] Reset link for ${to}: ${resetLink}`);
    return;
  }

  const response = await postJson(
    "https://api.resend.com/emails",
    {
      from: env.resendFromEmail,
      to,
      subject: "Reset your password",
      html: `<p>You requested a password reset for your Pawwl account.</p><p><a href=\"${resetLink}\">Reset password</a></p><p>This link expires in ${env.resetPasswordTtlMinutes} minutes.</p><p>If this wasn't you, you can ignore this email.</p>`,
    },
    {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Failed to send reset email (${response.status}): ${body}`);
  }
};
