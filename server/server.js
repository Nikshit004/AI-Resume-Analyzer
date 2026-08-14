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
app.use(
  cors({
    origin: [
      "https://ai-resume-analyzer-psi-bay.vercel.app",
      "https://ai-resume-analyzer-git-main-nikshitsondagar078-8288s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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