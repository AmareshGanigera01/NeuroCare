const express = require("express");
const router = express.Router();

const {
  submitMemoryTest,
  getAllMemoryTests,
  getMemoryTestById,
  getLatestMemoryTest,
  deleteMemoryTest,
} = require("../controllers/memoryTestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ========================
// MEMORY TEST ROUTES
// ========================

/**
 * @route   POST /api/memory-test/submit
 * @desc    Submit a new memory test result
 * @access  Private (Patient/Caregiver)
 */
router.post("/submit", protect, authorizeRoles("patient", "caregiver"), submitMemoryTest);

/**
 * @route   GET /api/memory-test/all
 * @desc    Get all memory test results for logged-in user
 * @access  Private (Patient/Caregiver)
 */
router.get("/all", protect, authorizeRoles("patient", "caregiver"), getAllMemoryTests);

/**
 * @route   GET /api/memory-test/latest
 * @desc    Get latest memory test result
 * @access  Private (Patient/Caregiver)
 */
router.get("/latest", protect, authorizeRoles("patient", "caregiver"), getLatestMemoryTest);

/**
 * @route   GET /api/memory-test/:id
 * @desc    Get memory test by ID
 * @access  Private
 */
router.get("/:id", protect, authorizeRoles("patient", "caregiver"), getMemoryTestById);

/**
 * @route   DELETE /api/memory-test/:id
 * @desc    Delete memory test (Doctor only)
 * @access  Private
 */
router.delete("/:id", protect, authorizeRoles("doctor"), deleteMemoryTest);

module.exports = router;