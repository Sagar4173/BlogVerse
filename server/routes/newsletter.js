const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dbConnect = require("../utils/dbConnect");

// Newsletter subscription schema
const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create model only if it doesn't exist
const Newsletter =
  mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);

// Middleware to ensure database connection
router.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(503).json({
      message: "Database connection unavailable",
      status: "error",
    });
  }
});

// @route   POST api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res
          .status(400)
          .json({ message: "Email is already subscribed to our newsletter" });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();

        return res.json({
          message: "Successfully resubscribed to our newsletter!",
          success: true,
        });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email: email.toLowerCase(),
    });

    await subscription.save();

    res.status(201).json({
      message: "Successfully subscribed to our newsletter!",
      success: true,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    res.status(500).json({
      message: "Failed to subscribe to newsletter",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const subscription = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "Email not found in our newsletter list" });
    }

    if (!subscription.isActive) {
      return res.status(400).json({ message: "Email is already unsubscribed" });
    }

    subscription.isActive = false;
    await subscription.save();

    res.json({
      message: "Successfully unsubscribed from our newsletter",
      success: true,
    });
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
    res.status(500).json({
      message: "Failed to unsubscribe from newsletter",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET api/newsletter/subscribers
// @desc    Get newsletter subscribers (admin only)
// @access  Private (admin)
router.get("/subscribers", async (req, res) => {
  try {
    // Note: Add admin authentication middleware here in production
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Newsletter.find({ isActive: true })
        .select("email subscribedAt")
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    res.json({
      subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    res.status(500).json({
      message: "Failed to fetch newsletter subscribers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET api/newsletter/stats
// @desc    Get newsletter statistics
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const [totalSubscribers, recentSubscribers] = await Promise.all([
      Newsletter.countDocuments({ isActive: true }),
      Newsletter.countDocuments({
        isActive: true,
        subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      }),
    ]);

    res.json({
      totalSubscribers,
      recentSubscribers,
      growthRate:
        totalSubscribers > 0
          ? ((recentSubscribers / totalSubscribers) * 100).toFixed(1)
          : 0,
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    res.status(500).json({
      message: "Failed to fetch newsletter statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
