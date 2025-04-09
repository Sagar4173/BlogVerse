const mongoose = require("mongoose");

// Track the connection state
let isConnected = false;

/**
 * Connect to MongoDB
 * This function will handle connection/reconnection logic
 */
const dbConnect = async () => {
  // If already connected, return the existing connection
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // Check connection state
    if (mongoose.connection.readyState !== 1) {
      console.log("Creating new MongoDB connection...");

      // Set mongoose options
      mongoose.set("strictQuery", false);

      // Connect to MongoDB
      const db = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s of selection retry
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });

      console.log("MongoDB connected!");
      isConnected = true;
      return db;
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

module.exports = dbConnect;
