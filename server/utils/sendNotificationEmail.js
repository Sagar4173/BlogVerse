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

const sendNotificationEmail = async (to, subject, text) => {
  try {
    const transporter = createTransporter();

    // Skip if transporter couldn't be created
    if (!transporter) {
      return false;
    }

    // Set a timeout for email operations
    const emailPromise = transporter.sendMail({
      from: `"BlogVerse" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    // Use Promise.race to add a 3-second timeout
    const result = await Promise.race([
      emailPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out")), 3000)
      ),
    ]);

    console.log(`Notification email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending notification email:", error);
    return false;
  }
};

module.exports = sendNotificationEmail;
