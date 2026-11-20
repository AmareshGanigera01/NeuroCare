const express = require("express");
const router = express.Router();

const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getMyPatientProfile,
  updateMyPatientProfile,
} = require("../controllers/patientController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ========================
// PATIENT ROUTES
// ========================

/**
 * @route   POST /api/patients/create
 * @desc    Create a new patient profile
 * @access  Private (Caregiver/Doctor/Admin)
 */
router.post("/create", protect, authorizeRoles("doctor", "caregiver"), createPatient);

/**
 * @route   GET /api/patients
 * @desc    Get all patients (Caregiver dashboard)
 * @access  Private (Caregiver)
 */
router.get("/", protect, authorizeRoles("caregiver"), getAllPatients);

/**
 * @route   GET /api/patients/me
 * @desc    Get logged-in patient's profile
 * @access  Private (Patient)
 */
router.get("/me", protect, authorizeRoles("patient"), getMyPatientProfile);
router.put("/me", protect, authorizeRoles("patient"), updateMyPatientProfile);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private
 */
router.get("/:id", protect, authorizeRoles("caregiver"), getPatientById);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient medical/details info
 * @access  Private (Caregiver)
 */
router.put("/:id", protect, authorizeRoles("caregiver"), updatePatient);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient record (Caregiver only)
 * @access  Private
 */
router.delete("/:id", protect, authorizeRoles("caregiver"), deletePatient);

module.exports = router;