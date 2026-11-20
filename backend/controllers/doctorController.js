const db = require("../db");

exports.getOverview = (req, res) => {
  const doctorId = req.user.id;

  const patientsSql = "SELECT COUNT(*) AS patientCount FROM patients WHERE doctor_id = ?";
  const appointmentsSql = "SELECT COUNT(*) AS upcomingAppointments FROM appointments WHERE doctor_id = ? AND scheduled_at >= NOW()";
  const emergenciesSql = `
    SELECT COUNT(*) AS activeAlerts
    FROM emergencies e
    INNER JOIN patients p ON e.user_id = p.user_id
    WHERE p.doctor_id = ? AND e.status IN ('ACTIVE','IN_PROGRESS')
  `;

  db.query(patientsSql, [doctorId], (err, patientResult) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch doctor overview", error: err.message });
    }

    db.query(appointmentsSql, [doctorId], (apptErr, appointmentResult) => {
      if (apptErr) {
        return res.status(500).json({ message: "Failed to fetch doctor overview", error: apptErr.message });
      }

      db.query(emergenciesSql, [doctorId], (emergencyErr, emergencyResult) => {
        if (emergencyErr) {
          return res.status(500).json({ message: "Failed to fetch doctor overview", error: emergencyErr.message });
        }

        res.json({
          patientCount: patientResult[0].patientCount || 0,
          upcomingAppointments: appointmentResult[0].upcomingAppointments || 0,
          activeAlerts: emergencyResult[0].activeAlerts || 0,
        });
      });
    });
  });
};

exports.getDoctorPatients = (req, res) => {
  const doctorId = req.user.id;
  const sql = `
    SELECT p.id, p.user_id, p.name, p.age, p.gender, p.address, p.phone, p.caretaker_contact, p.notes, u.email
    FROM patients p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.doctor_id = ?
    ORDER BY p.name ASC
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch assigned patients", error: err.message });
    }
    res.json(results);
  });
};

exports.getDoctorAppointments = (req, res) => {
  const doctorId = req.user.id;
  const sql = `
    SELECT a.id, a.patient_id, a.doctor_id, a.scheduled_at, a.reason, a.status,
      p.name AS patient_name,
      u.email AS patient_email
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE a.doctor_id = ?
    ORDER BY a.scheduled_at ASC
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
    }
    res.json(results);
  });
};

exports.getDoctorEmergencies = (req, res) => {
  const doctorId = req.user.id;
  const sql = `
    SELECT e.id, e.user_id, e.event, e.location, e.status, e.timestamp,
      p.id AS patient_id,
      p.name AS patient_name,
      u.email AS patient_email
    FROM emergencies e
    INNER JOIN patients p ON e.user_id = p.user_id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.doctor_id = ?
    ORDER BY e.timestamp DESC
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch emergency alerts", error: err.message });
    }
    res.json(results);
  });
};

exports.getDoctorReports = (req, res) => {
  const doctorId = req.user.id;
  const summarySql = `
    SELECT
      COUNT(DISTINCT p.id) AS patientsAssigned,
      COUNT(mt.id) AS totalMemoryTests,
      ROUND(AVG(mt.score), 1) AS averageMemoryScore
    FROM patients p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN memory_tests mt ON mt.user_id = p.user_id
    WHERE p.doctor_id = ?
  `;

  db.query(summarySql, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch doctor reports", error: err.message });
    }

    const summary = results[0] || { patientsAssigned: 0, totalMemoryTests: 0, averageMemoryScore: 0 };
    res.json({
      patientsAssigned: summary.patientsAssigned || 0,
      totalMemoryTests: summary.totalMemoryTests || 0,
      averageMemoryScore: summary.averageMemoryScore || 0,
    });
  });
};
