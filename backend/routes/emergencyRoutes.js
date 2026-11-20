const express = require("express");
const router = express.Router();

const {
  triggerEmergency,
  getEmergencyHistory,
  getEmergencyById,
  updateEmergencyStatus,
  deleteEmergency,
} = require("../controllers/emergencyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ========================
// Emergency Routes
// ========================

/**
 * @route   POST /api/emergency/trigger
 * @desc    Trigger emergency alert (SOS button)
 * @access  Private (Patient / Caregiver)
 */
router.post("/trigger", protect, authorizeRoles("patient", "caregiver"), triggerEmergency);

/**
 * @route   GET /api/emergency/history
 * @desc    Get all emergency alerts for logged-in user
 * @access  Private (Patient/Caregiver)
 */
router.get("/history", protect, authorizeRoles("patient", "caregiver"), getEmergencyHistory);

/**
 * @route   GET /api/emergency/:id
 * @desc    Get single emergency record by ID
 * @access  Private
 */
router.get("/:id", protect, authorizeRoles("patient", "caregiver"), getEmergencyById);

/**
 * @route   PUT /api/emergency/:id
 * @desc    Update emergency status (e.g., RESOLVED, IN_PROGRESS)
 * @access  Private (Doctor/Caregiver)
 */
router.put("/:id", protect, authorizeRoles("doctor", "caregiver"), updateEmergencyStatus);

/**
 * @route   DELETE /api/emergency/:id
 * @desc    Delete emergency record (Doctor only)
 * @access  Private
 */
router.delete("/:id", protect, authorizeRoles("doctor"), deleteEmergency);

module.exports = router;