const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { sendContactEmail } = require("../utils/email");
const dbConnect = require("../utils/dbConnect");

// Middleware to ensure database connection
router.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(503).json({
      message: "Service temporarily unavailable",
      status: "error",
    });
  }
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters long"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, subject, message } = req.body;

      // Send contact email
      const emailSent = await sendContactEmail({
        name,
        email,
        subject,
        message,
      });

      if (!emailSent) {
        return res.status(500).json({
          message: "Failed to send contact message. Please try again later.",
        });
      }

      res.status(200).json({
        message:
          "Contact message sent successfully! We'll get back to you soon.",
        status: "success",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
        status: "error",
      });
    }
  }
);

module.exports = router;
