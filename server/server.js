const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const dbConnect = require("./utils/dbConnect");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL, "https://blogverse-client.vercel.app"]
        : process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const blogRoutes = require("./routes/blogs");

// Add root route handler for Vercel deployment
app.get("/", (req, res) => {
  res.json({
    message: "BlogVerse API is running",
    status: "online",
    dbStatus:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      blogs: "/api/blogs",
    },
    documentation: "See README for API documentation",
  });
});

// Initial DB connection only in development
// In production/serverless, we'll connect per-request
if (process.env.NODE_ENV !== "production") {
  // Connect to MongoDB in development environment
  dbConnect()
    .then(() => console.log("MongoDB connected in development mode"))
    .catch((err) => console.error("Initial MongoDB connection error:", err));
}

// Handle MongoDB connection events for better debugging
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected, will reconnect on next request");
  isConnected = false;
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Server setup for different environments
const server = http.createServer(app);

// Conditional Socket.IO setup with improved serverless compatibility
let io;
if (process.env.NODE_ENV !== "production") {
  // Development environment - full Socket.IO setup
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
} else {
  // Production/serverless environment - minimal Socket.IO setup
  // This avoids keeping connections open which isn't supported in serverless
  io = {
    to: () => ({ emit: () => {} }),
    on: () => {},
    emit: () => {},
  };
}

// Export io instance for use in notification service
module.exports.io = io;

const PORT = process.env.PORT || 5000;

// Only listen on a port in development, not needed for serverless
if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for serverless
module.exports = app;
