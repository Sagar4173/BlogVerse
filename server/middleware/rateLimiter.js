const rateLimit = require("express-rate-limit");

// Stricter rate limiting for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: "Too many password reset attempts, please try again in an hour.",
  },
});

// Email verification rate limiter
const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 email verification requests per 15 minutes
  message: {
    success: false,
    message: "Too many verification attempts, please try again later.",
  },
});

// Blog creation rate limiter
const blogCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 blog posts per hour
  message: {
    success: false,
    message: "You've reached the blog creation limit. Please try again later.",
  },
});

module.exports = {
  strictLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  blogCreationLimiter,
};
