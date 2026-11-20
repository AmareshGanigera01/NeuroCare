const express = require("express");
const router = express.Router();

const {
  getOverview,
  getDoctorPatients,
  getDoctorAppointments,
  getDoctorEmergencies,
  getDoctorReports,
} = require("../controllers/doctorController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ========================
// DOCTOR ROUTES
// ========================

router.get("/overview", protect, authorizeRoles("doctor"), getOverview);
router.get("/patients", protect, authorizeRoles("doctor"), getDoctorPatients);
router.get("/appointments", protect, authorizeRoles("doctor"), getDoctorAppointments);
router.get("/emergencies", protect, authorizeRoles("doctor"), getDoctorEmergencies);
router.get("/reports", protect, authorizeRoles("doctor"), getDoctorReports);

module.exports = router;
