import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.gmailUser,
    pass: env.gmailAppPassword,
  },
});

// Lightweight background retry queue for emails
const sendMailWithRetry = async (mailOptions: nodemailer.SendMailOptions, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (err: any) {
      console.error(`[mailer] Failed to send email (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) throw err;
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

const getBaseEmailTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .header { background-color: #012169; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; }
  .content { padding: 40px 30px; line-height: 1.6; }
  .content h2 { color: #134e86; margin-top: 0; font-size: 22px; }
  .footer { background-color: #bbedf4; padding: 20px; text-align: center; font-size: 13px; color: #1b4965; }
  .btn { display: inline-block; background-color: #134e86; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; }
  .info-box { background-color: #f9f9f9; border-left: 4px solid #58a4cf; padding: 15px; border-radius: 0 6px 6px 0; margin: 20px 0; }
  .highlight { font-weight: bold; color: #012169; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pawwl</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">
      <p>Made with love for your pets 🐾</p>
      <p>&copy; ${new Date().getFullYear()} Pawwl. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendOrderConfirmation = async (to: string, orderNumber: string, total: number) => {
  if (!env.gmailUser || !env.gmailAppPassword) return;

  const content = `
    <p>Thank you for your order! We've successfully received your payment and are getting your items ready to ship.</p>
    <div class="info-box">
      <p style="margin: 0;"><strong>Order Number:</strong> <span class="highlight">#${orderNumber}</span></p>
      <p style="margin: 5px 0 0 0;"><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
    </div>
    <p>We'll send you another email with tracking information once your order ships.</p>
    <a href="${env.frontendOrigin}/account/orders" class="btn" style="color: white;">View Order Details</a>
  `;

  await sendMailWithRetry({
    from: `"Pawwl" <${env.gmailUser}>`,
    to,
    subject: `Order Confirmation #${orderNumber}`,
    html: getBaseEmailTemplate("Order Confirmation", content),
  });
};

export const sendShippingUpdate = async (to: string, orderNumber: string, trackingUrl: string | null) => {
  if (!env.gmailUser || !env.gmailAppPassword) return;

  const trackingHtml = trackingUrl 
    ? `<p>Track your package here:</p><a href="${trackingUrl}" class="btn" style="color: white;">Track Order</a>`
    : `<p>Your package is on its way and should arrive soon!</p>`;

  const content = `
    <p>Great news! Your order <span class="highlight">#${orderNumber}</span> has been handed over to our delivery partners.</p>
    ${trackingHtml}
    <p style="margin-top: 30px; font-size: 14px; color: #666;">If you have any questions, simply reply to this email!</p>
  `;

  await sendMailWithRetry({
    from: `"Pawwl" <${env.gmailUser}>`,
    to,
    subject: `Your Order #${orderNumber} Has Shipped! 🚚`,
    html: getBaseEmailTemplate("Your Order Has Shipped!", content),
  });
};

export const sendOrderDelivered = async (to: string, orderNumber: string) => {
  if (!env.gmailUser || !env.gmailAppPassword) return;

  const content = `
    <p>Your order <span class="highlight">#${orderNumber}</span> has been marked as delivered!</p>
    <div class="info-box" style="border-left-color: #134e86;">
      <p style="margin: 0;">We hope you and your furry friend love the items.</p>
    </div>
    <p>If you have a moment, we'd love to hear your feedback.</p>
    <a href="${env.frontendOrigin}/account/orders" class="btn" style="color: white;">Review Your Purchase</a>
  `;

  await sendMailWithRetry({
    from: `"Pawwl" <${env.gmailUser}>`,
    to,
    subject: `Your Order #${orderNumber} Has Arrived! 🎉`,
    html: getBaseEmailTemplate("Your Package is Here!", content),
  });
};

export const sendOrderCancelled = async (to: string, orderNumber: string) => {
  if (!env.gmailUser || !env.gmailAppPassword) return;

  const content = `
    <p>We are writing to confirm that your order <span class="highlight">#${orderNumber}</span> has been cancelled.</p>
    <p>If you had already paid for this order, the refund process has been initiated. It usually takes 3-5 business days for the amount to reflect in your original payment method.</p>
    <div class="info-box" style="border-left-color: #ff4d4f;">
      <p style="margin: 0;">If you have any questions or didn't request this cancellation, please contact us immediately.</p>
    </div>
  `;

  await sendMailWithRetry({
    from: `"Pawwl" <${env.gmailUser}>`,
    to,
    subject: `Order #${orderNumber} Cancelled`,
    html: getBaseEmailTemplate("Order Cancelled", content),
  });
};

export const sendAbandonedCart = async (to: string, name: string) => {
  const html = getBaseEmailTemplate(
    "You left something behind! 🛒",
    `
    <h2 style="color: #134e86; margin-top: 0;">Hi ${name},</h2>
    <p>We noticed you left some amazing items in your cart. They're waiting for you!</p>
    <a href="${env.frontendOrigin}/cart" class="btn" style="color: white;">Return to Checkout</a>
  `
  );

  await sendMailWithRetry({
    from: `"Pawwl" <${env.gmailUser}>`,
    to,
    subject: `You left something behind! 🛒`,
    html,
  });
};

export const sendNewLeadNotification = async (lead: any) => {
  console.log("Mock sending lead email:", lead);
};

export const sendNewJobApplicationNotification = async (app: any) => {
  console.log("Mock sending job app email:", app);
};

export const sendServiceLeadEmail = async (lead: any) => {
  const adminEmails = ["admin@pawwl.com", "support.pawwl@gmail.com"];
  
  const html = getBaseEmailTemplate(
    "New Service Booking Request",
    `
    <h2 style="color: #134e86; margin-top: 0;">New Booking Request</h2>
    <p><strong>Name:</strong> ${lead.name}</p>
    <p><strong>Phone:</strong> ${lead.phone}</p>
    <p><strong>Pet:</strong> ${lead.petName || 'N/A'} (${lead.petType || 'N/A'})</p>
    <p><strong>Service:</strong> ${lead.service}</p>
    <p><strong>Date & Time:</strong> ${new Date(lead.date).toLocaleDateString()} at ${lead.timeSlot}</p>
    <br/>
    <p>Please contact the customer to confirm the booking.</p>
  `
  );

  await sendMailWithRetry({
    from: `"Pawwl Leads" <${env.gmailUser}>`,
    to: adminEmails.join(", "),
    subject: `New Booking Request: ${lead.name} (${lead.service})`,
    html,
  });
};

export const sendJobApplicationEmail = async (app: any) => {
  const adminEmails = ["admin@pawwl.com", "support.pawwl@gmail.com"];
  
  const html = getBaseEmailTemplate(
    "New Job Application Received",
    `
    <h2 style="color: #134e86; margin-top: 0;">New Job Application</h2>
    <p><strong>Position:</strong> ${app.jobTitle}</p>
    <p><strong>Applicant Name:</strong> ${app.name}</p>
    <p><strong>Email:</strong> ${app.email}</p>
    <p><strong>Phone:</strong> ${app.phone}</p>
    ${app.coverLetter ? `<p><strong>Cover Letter:</strong><br/>${app.coverLetter.replace(/\n/g, '<br/>')}</p>` : ''}
    <br/>
    <p>You can view this application in the Admin Dashboard.</p>
  `
  );

  await sendMailWithRetry({
    from: `"Pawwl Careers" <${env.gmailUser}>`,
    to: adminEmails.join(", "),
    subject: `New Application: ${app.name} for ${app.jobTitle}`,
    html,
  });
};
