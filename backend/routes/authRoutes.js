const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ========================
// Public Routes
// ========================

// Register new user (patient / caregiver / doctor)
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// ========================
// Protected Routes
// ========================

// Logout user (invalidate token or clear session)
router.post("/logout", protect, logoutUser);

// Get logged-in user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;