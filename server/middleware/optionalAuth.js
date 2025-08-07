const jwt = require("jsonwebtoken");

// Optional authentication middleware - sets req.user if token is present but doesn't block if absent
module.exports = function (req, res, next) {
  // Get token from header
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  // If no token, continue without setting req.user
  if (!token) {
    return next();
  }

  // Verify token if present
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
  } catch (err) {
    // Invalid token - continue without setting req.user
    console.log("Invalid token in optional auth:", err.message);
  }

  next();
};
