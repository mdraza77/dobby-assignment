const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/folders", require("./routes/folder"));
app.use("/api/files", require("./routes/file"));
app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.send("Server running good!");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("DB Connection Error: ", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
