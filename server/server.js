const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const dbConnect = require("./utils/dbConnect");

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use("/api/auth", authLimiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins =
        process.env.NODE_ENV === "production"
          ? [process.env.CLIENT_URL, "https://blogverse-client.vercel.app"]
          : [
              "http://localhost:3000",
              "http://127.0.0.1:3000",
              "http://localhost:3001", // Backup port
            ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, be more permissive
      if (process.env.NODE_ENV === "development") {
        console.log(`CORS: Allowing origin ${origin} in development mode`);
        return callback(null, true);
      }

      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Length", "X-JSON"],
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const blogRoutes = require("./routes/blogs");
const uploadRoutes = require("./routes/upload");
const newsletterRoutes = require("./routes/newsletter");

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

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With,Accept,Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

// Track MongoDB connection status
let isConnected = false;

// Initial DB connection only in development
// In production/serverless, we'll connect per-request
if (process.env.NODE_ENV !== "production") {
  // Connect to MongoDB in development environment
  dbConnect()
    .then(() => {
      console.log("MongoDB connected in development mode");
      isConnected = true;
    })
    .catch((err) => console.error("Initial MongoDB connection error:", err));
}

// Handle MongoDB connection events for better debugging
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected, will reconnect on next request");
  isConnected = false;
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
  isConnected = true;
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  isConnected = true;
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
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
