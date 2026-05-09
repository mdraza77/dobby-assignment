const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Added for path handling
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/folders", require("./routes/folder"));
app.use("/api/files", require("./routes/file"));

// Serve Static Files - Best practice for Render
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running perfectly on Cloud!");
});

// Database Connection
// Use process.env.MONGO_URI for Atlas and fallback to local for development
const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dobby_db";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Atlas Connected Successfully!"))
  .catch((err) => {
    console.log("DB Connection Error: ", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is live on port ${PORT}`);
});
