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

// ---------------- DATABASE FEATURE (Checkpoint 2) ----------------

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  name: process.env.DB_NAME || "csp451_demo"
  engine: "postgres"
};

function getDbConnectionString() {
  return `postgres://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
}

function simulateDbConnection() {
  return {
    connected: true,
    checkedAt: new Date().toISOString()
  };
}

// GET database config
app.get("/api/db/config", (req, res) => {
  res.json({
    success: true,
    config: dbConfig,
    connectionString: getDbConnectionString()
  });
});

// GET database health check
app.get("/api/db/health", (req, res) => {
  const status = simulateDbConnection();
  res.json({
    success: true,
    status
  });
});
