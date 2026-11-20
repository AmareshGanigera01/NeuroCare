const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const memoryTestRoutes = require("./routes/memoryTestRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// Initialize app
const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));
app.use(express.static(path.join(__dirname, "..", "html")));

// ========================
// TEST ROUTE
// ========================
app.get("/", (req, res) => {
  res.send("🧠 Alzheimer AI Backend is Running Successfully");
});

// Doctor dashboard path alias for server-hosted front-end
app.get("/doctor-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "doctor-dashboard.html"));
});

// ========================
// API ROUTES
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/memory-test", memoryTestRoutes);
app.use("/api/doctor", doctorRoutes);

// ========================
// ERROR HANDLING MIDDLEWARE
// ========================
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




