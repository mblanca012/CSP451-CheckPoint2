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

// ---------------- AUTH FEATURE (Checkpoint 2) ----------------

// demo users (in-memory, no DB)
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

// validate login input
function validateLogin(body) {
  const errors = [];
  if (!body) errors.push("Missing request body");
  if (!body?.username) errors.push("Username is required");
  if (!body?.password) errors.push("Password is required");
  return errors;
}

// authenticate user
function authenticate(username, password) {
  return users.find(
    (u) => u.username === username && u.password === password
  );
}

// GET login page placeholder
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login Page</h2>
    <p>Use POST /api/auth/login</p>
  `);
});

// POST login endpoint
app.post("/api/auth/login", (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  const user = authenticate(req.body.username, req.body.password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = Buffer.from(
    `${user.username}:${user.role}`
  ).toString("base64");

  res.json({
    success: true,
    user: { username: user.username, role: user.role },
    token
  });
});

// POST logout endpoint
app.post("/api/auth/logout", (req, res) => {
 res.json({
  success: true,
  message: "Logged out successfully",
  timestamp: new Date().toISOString()
});

