const express = require("express");
const path = require("path");

const { router: apiRouter } = require("./routes/api");
const { router: viewRouter } = require("./routes/views");

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", viewRouter);
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler (keep simple for learning)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// ---------------- API FEATURE (Checkpoint 2) ----------------

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API version info
app.get("/api/version", (req, res) => {
  res.json({
    success: true,
    name: "csp451-web-starter",
    version: "1.0.0"
  });
});

// API echo (test POST payloads)
app.post("/api/echo", (req, res) => {
  res.json({
    success: true,
    received: req.body || null
  });
});

// Example users endpoint
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]
  });
});
