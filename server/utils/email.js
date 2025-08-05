const nodemailer = require("nodemailer");

// Create transporter only when needed, not at module level
const createTransporter = () => {
  // Skip sending emails if configuration is missing
  if (
    !process.env.EMAIL_SERVICE ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Email configuration missing - emails will not be sent");
    }
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

// Email template styles
const emailStyles = `
  <style>
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      padding: 0; 
      border-radius: 10px; 
      box-shadow: 0 0 20px rgba(0,0,0,0.1); 
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #0FA4AF 0%, #024950 100%); 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: bold; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .otp-box { 
      background: #f8f9fa; 
      border: 2px dashed #0FA4AF; 
      padding: 20px; 
      text-align: center; 
      margin: 20px 0; 
      border-radius: 8px; 
    }
    .otp-code { 
      font-size: 32px; 
      font-weight: bold; 
      color: #0FA4AF; 
      letter-spacing: 8px; 
      margin: 10px 0; 
    }
    .button { 
      display: inline-block; 
      padding: 15px 30px; 
      background: linear-gradient(135deg, #0FA4AF 0%, #024950 100%); 
      color: white; 
      text-decoration: none; 
      border-radius: 8px; 
      margin: 20px 0; 
      font-weight: bold; 
      text-align: center;
    }
    .footer { 
      background: #f8f9fa; 
      padding: 20px; 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
    }
    .warning { 
      background: #fff3cd; 
      border-left: 4px solid #ffc107; 
      padding: 15px; 
      margin: 20px 0; 
    }
    .success { 
      background: #d4edda; 
      border-left: 4px solid #28a745; 
      padding: 15px; 
      margin: 20px 0; 
    }
  </style>
`;

// Send OTP verification email
exports.sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error("Email service not configured");
    }

    const message = {
      from: `"BlogVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - BlogVerse Registration",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Welcome to BlogVerse!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Thank you for joining BlogVerse, the premier platform for passionate writers and readers!</p>
              
              <p>To complete your registration, please verify your email address using the OTP code below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-weight: bold;">Your Verification Code:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 14px; color: #666;">This code expires in 10 minutes</p>
              </div>
              
              <div class="warning">
                <strong>Important:</strong> Never share this code with anyone. BlogVerse will never ask for your verification code via phone or email.
              </div>
              
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>✍️ Create and publish amazing blog posts</li>
                <li>🔍 Discover content from talented writers</li>
                <li>💬 Engage with the community through comments</li>
                <li>📚 Build your personal reading library</li>
              </ul>
              
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 BlogVerse. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(message);
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP verification email sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Send welcome email after successful verification
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error("Email service not configured");
    }

    const clientDomain = process.env.CLIENT_URL || "http://localhost:5173";

    const message = {
      from: `"BlogVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to BlogVerse - Let's Start Your Journey!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to BlogVerse!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${name}! 🌟</h2>
              
              <div class="success">
                Your email has been successfully verified! Your BlogVerse account is now active and ready to use.
              </div>
              
              <p>You're now part of a vibrant community of writers, readers, and storytellers. Here's what you can do next:</p>
              
              <div style="margin: 30px 0;">
                <h3>🚀 Get Started:</h3>
                <ul>
                  <li><strong>Complete Your Profile:</strong> Add a bio, profile picture, and showcase your expertise</li>
                  <li><strong>Write Your First Post:</strong> Share your thoughts and stories with the world</li>
                  <li><strong>Explore Content:</strong> Discover amazing posts from our community</li>
                  <li><strong>Connect:</strong> Follow writers whose content resonates with you</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${clientDomain}" class="button">Start Writing Now! ✍️</a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h4>📚 Pro Tips for Success:</h4>
                <ul>
                  <li>Use engaging titles to attract readers</li>
                  <li>Add relevant tags to increase discoverability</li>
                  <li>Engage with other writers' content</li>
                  <li>Consistency is key - try to post regularly</li>
                </ul>
              </div>
              
              <p>We're excited to see what amazing content you'll create!</p>
              
              <p>Happy writing,<br>The BlogVerse Team 💙</p>
            </div>
            <div class="footer">
              <p>© 2025 BlogVerse. All rights reserved.</p>
              <p>Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">support@blogverse.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(message);
    if (process.env.NODE_ENV === "development") {
      console.log(`Welcome email sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

// Send password reset email
exports.sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error("Email service not configured");
    }

    const clientDomain = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientDomain}/reset-password/${token}`;

    const message = {
      from: `"BlogVerse Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your BlogVerse Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              
              <p>We received a request to reset your BlogVerse account password. If you made this request, click the button below to set a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset My Password 🔑</a>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Or copy and paste this link:</strong></p>
                <p style="word-break: break-all; margin: 10px 0 0 0; font-size: 14px;">${resetUrl}</p>
              </div>
              
              <div class="warning">
                <strong>Security Notice:</strong><br>
                • This link will expire in 1 hour for your security<br>
                • If you didn't request this reset, please ignore this email<br>
                • Your password will remain unchanged if you don't click the link
              </div>
              
              <p>For your account security, never share this reset link with anyone.</p>
              
              <h3>🛡️ Account Security Tips:</h3>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication when available</li>
                <li>Keep your email account secure</li>
                <li>Log out from shared devices</li>
              </ul>
              
              <p>If you continue to have problems, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2025 BlogVerse. All rights reserved.</p>
              <p>This is an automated security message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(message);
    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset email sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Send password reset confirmation email
exports.sendPasswordResetConfirmationEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error("Email service not configured");
    }

    const message = {
      from: `"BlogVerse Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Password Successfully Reset - BlogVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Reset Successful</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <div class="success">
                Your BlogVerse account password has been successfully reset and updated.
              </div>
              
              <p>This email confirms that your password was changed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.</p>
              
              <h3>🔐 What happens next:</h3>
              <ul>
                <li>You can now log in with your new password</li>
                <li>All other devices will be logged out for security</li>
                <li>Your account remains fully secure</li>
              </ul>
              
              <div class="warning">
                <strong>Didn't make this change?</strong><br>
                If you didn't reset your password, please contact our support team immediately and change your password again.
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.CLIENT_URL
                }/login" class="button">Login to Your Account 🚀</a>
              </div>
              
              <p>Thank you for keeping your account secure!</p>
              
              <p>Best regards,<br>The BlogVerse Security Team</p>
            </div>
            <div class="footer">
              <p>© 2025 BlogVerse. All rights reserved.</p>
              <p>Need help? Contact us at <a href="mailto:${
                process.env.EMAIL_USER
              }">security@blogverse.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(message);
    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset confirmation email sent to ${email}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    throw error;
  }
};

// Send contact form email
exports.sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.warn("Email transporter not available");
      return false;
    }

    const mailOptions = {
      from: `"BlogVerse Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: email, // Allow admin to reply directly to sender
      subject: `📧 Contact Form: ${subject}`,
      html: getEmailTemplate(`
        <div style="text-align: center; margin-bottom: 30px;">
          <h1>📧 New Contact Form Submission</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h2>Contact Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <h3>Message:</h3>
          <p style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
          <p style="margin: 0; font-size: 14px; color: #6c757d;">
            📧 You can reply directly to this email to respond to ${name}
          </p>
        </div>
      `),
    };

    await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === "development") {
      console.log(`Contact form email sent from ${email}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return false;
  }
};
