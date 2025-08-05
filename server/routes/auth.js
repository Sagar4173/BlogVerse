const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path and model name are correct
const auth = require("../middleware/auth");
const {
  sendResetPasswordEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetConfirmationEmail,
} = require("../utils/email");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const dbConnect = require("../utils/dbConnect");

// Use memory storage instead of disk storage for Vercel compatibility
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to ensure database connection for all routes
router.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    return res.status(503).json({
      message: "Database connection unavailable",
      status: "error",
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (with OTP verification)
// @access  Public
router.post(
  "/register",
  upload.single("profilePicture"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser && existingUser.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists and is verified",
        });
      }

      // Store registration data temporarily in session/memory
      // We'll create the user only after email verification
      let tempUserData = {
        name,
        email,
        password,
        emailVerified: false,
      };

      // Handle profile picture upload if provided
      let profilePictureUrl = null;
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString(
              "base64"
            )}`,
            {
              folder: "blogverse/avatars",
              width: 400,
              height: 400,
              crop: "fill",
            }
          );
          profilePictureUrl = result.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          // Continue registration even if image upload fails
        }
      }

      // If user exists but not verified, update their temp data
      let user;
      if (existingUser && !existingUser.emailVerified) {
        user = existingUser;
        user.name = name;
        user.password = password; // This will be hashed by the pre-save middleware
        if (profilePictureUrl) {
          user.profilePicture = profilePictureUrl;
        }
      } else {
        // Create temporary user (not verified)
        user = new User({
          ...tempUserData,
          profilePicture: profilePictureUrl,
        });
      }

      // Generate OTP
      const otp = user.generateEmailOTP();
      await user.save();

      // Send OTP email
      try {
        await sendOTPEmail(email, name, otp);
        res.json({
          success: true,
          message:
            "Registration successful! Please check your email for the verification code.",
          requiresVerification: true,
          email: email,
        });
      } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
        // Clean up user if email fails
        if (!existingUser) {
          await User.findByIdAndDelete(user._id);
        }
        return res.status(500).json({
          success: false,
          message: "Registration failed. Unable to send verification email.",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, otp } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified",
        });
      }

      // Verify OTP
      const isValidOTP = user.verifyEmailOTP(otp);
      if (!isValidOTP) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      // Mark email as verified
      user.emailVerified = true;
      user.emailOTP = undefined;
      user.emailOTPExpire = undefined;
      await user.save();

      // Send welcome email
      try {
        await sendWelcomeEmail(email, user.name);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail verification if welcome email fails
      }

      // Generate JWT token
      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            emailVerified: user.emailVerified,
          };
          res.json({
            success: true,
            message: "Email verified successfully! Welcome to BlogVerse!",
            token,
            user: userData,
          });
        }
      );
    } catch (err) {
      console.error("Email verification error:", err);
      res.status(500).json({
        success: false,
        message: "Server error during email verification",
      });
    }
  }
);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP verification email
// @access  Public
router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified",
        });
      }

      // Generate new OTP
      const otp = user.generateEmailOTP();
      await user.save();

      // Send OTP email
      try {
        await sendOTPEmail(email, user.name, otp);
        res.json({
          success: true,
          message: "Verification code resent! Please check your email.",
        });
      } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      res.status(500).json({
        success: false,
        message: "Server error while resending OTP",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, password } = req.body;

      // Check if user exists
      // Login attempt tracking
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Login failed - User not found");
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        console.log("Login failed - Email not verified");

        // Generate new OTP and resend email for convenience
        try {
          const otp = user.generateEmailOTP();
          await user.save();
          await sendOTPEmail(email, user.name, otp);
          console.log("New OTP sent to unverified user");
        } catch (emailError) {
          console.error("Error sending OTP during login:", emailError);
          // Don't fail the response if email fails, user can still use resend
        }

        return res.status(400).json({
          success: false,
          message:
            "Please verify your email before logging in. We've sent a new verification code to your email.",
          requiresVerification: true,
          email: email,
        });
      }

      console.log("User found:", {
        id: user._id,
        email: user.email,
        hasPassword: !!user.password,
        emailVerified: user.emailVerified,
      });

      // Check password using the model's method
      // Password comparison in production
      try {
        const isMatch = await user.comparePassword(password);
        console.log("Model comparePassword result:", isMatch);

        if (!isMatch) {
          console.log("Login failed - Password does not match");
          return res.status(400).json({
            success: false,
            message: "Invalid credentials",
          });
        }
        console.log("Password matched successfully");

        // Create token
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
          (err, token) => {
            if (err) throw err;
            // Include user data in response (excluding password)
            const userData = {
              _id: user._id,
              name: user.name,
              email: user.email,
              profilePicture: user.profilePicture,
              role: user.role,
              emailVerified: user.emailVerified,
            };
            console.log("Login successful - Sending response");
            res.json({
              success: true,
              token,
              user: userData,
            });
          }
        );
      } catch (error) {
        console.error("Password comparison error:", error);
        res.status(500).json({
          success: false,
          message: "Error during authentication",
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found with this email address",
        });
      }

      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save();

      // Send email
      try {
        await sendResetPasswordEmail(user.email, resetToken);
        res.json({
          success: true,
          message:
            "Password reset email sent! Please check your inbox and follow the instructions to reset your password.",
        });
      } catch (err) {
        console.error("Error sending password reset email:", err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({
          success: false,
          message:
            "Failed to send password reset email. Please try again later.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while processing password reset request",
      });
    }
  }
);

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      // Get hashed token
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      // Ensure email is verified when password is reset
      if (!user.emailVerified) {
        user.emailVerified = true;
      }

      await user.save();

      // Send password reset confirmation email
      try {
        await sendPasswordResetConfirmationEmail(user.email, user.name);
      } catch (emailError) {
        console.error(
          "Error sending password reset confirmation email:",
          emailError
        );
        // Don't fail the password reset if email fails
      }

      res.json({
        success: true,
        message:
          "Password updated successfully! You can now log in with your new password.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error while resetting password",
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  auth,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const updateFields = {};

      // Handle text fields
      if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
      if (req.body.socialLinks) {
        updateFields.socialLinks = JSON.parse(req.body.socialLinks);
      }

      // Handle profile picture upload
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString(
              "base64"
            )}`,
            {
              folder: "blogverse/avatars",
              width: 400,
              height: 400,
              crop: "fill",
            }
          );
          updateFields.profilePicture = result.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(400).json({
            success: false,
            message: "Failed to upload profile picture",
          });
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        user,
      });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
      });
    }
  }
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

module.exports = router;
