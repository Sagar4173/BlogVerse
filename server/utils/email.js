const nodemailer = require("nodemailer");

// Create transporter only when needed, not at module level
const createTransporter = () => {
  // Skip sending emails if configuration is missing
  if (
    !process.env.EMAIL_SERVICE ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
    console.warn("Email configuration missing - emails will not be sent");
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

exports.sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = createTransporter();

    // Skip if transporter couldn't be created
    if (!transporter) {
      console.warn(
        "Email transporter could not be created - reset email not sent"
      );
      throw new Error("Email service not configured");
    }

    const clientDomain =
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL || "https://blogverse-client.vercel.app"
        : "http://localhost:3000";

    const resetUrl = `${clientDomain}/reset-password/${token}`;

    const message = {
      from: `"Blog Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>You have requested to reset your password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #0FA4AF;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin: 16px 0;
        ">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    // Use Promise.race to add a 5-second timeout
    await Promise.race([
      transporter.sendMail(message),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out")), 5000)
      ),
    ]);

    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
