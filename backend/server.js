const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Importing Route Handlers
const userRoutes = require("./routes/user");
const employeeRoutes = require("./routes/employee");

// Database Setup
const DB_CONNECTION_STRING = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting Routers
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp/employees", employeeRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(DB_CONNECTION_STRING)
  .then(() => {
    // Connected to MongoDB
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Log connection error to the console
    console.error("Failed to connect to MongoDB", err);
  });
