// Backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const auditRoute = require("./routes/audit");

const app = express();
app.use(cors());
app.use(express.json()); // needed for req.body

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/web_audits";

// simple root route
app.get("/", (req, res) => {
  res.send("Backend root OK");
});

// /audit route
app.use("/audit", auditRoute);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will continue, but database operations may fail");
  });

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error("❌ Server listen error:", err);
  process.exit(1);
});

