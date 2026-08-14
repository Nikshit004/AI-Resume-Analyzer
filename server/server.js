require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const optimizeRoutes = require("./routes/optimizeRoutes");

const app = express();

// =======================
// Connect MongoDB
// =======================
connectDB();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Routes
// =======================
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/optimize", optimizeRoutes);

// =======================
// Test Route
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResumeAI Backend Running 🚀",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});