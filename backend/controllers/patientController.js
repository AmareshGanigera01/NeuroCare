const db = require("../db");

exports.createPatient = (req, res) => {
  const { user_id, doctor_id, name, age, gender, caretaker_contact, notes } = req.body;
  const patientUserId = user_id || (req.user.role === "patient" ? req.user.id : null);
  const assignedDoctorId = doctor_id || (req.user.role === "doctor" ? req.user.id : null);

  if (!patientUserId || !name || !age || !assignedDoctorId) {
    return res.status(400).json({ message: "patient user_id, name, age, and assigned doctor are required" });
  }

  const sql = `
    INSERT INTO patients (user_id, doctor_id, name, age, gender, caretaker_contact, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [patientUserId, assignedDoctorId, name, age, gender || "", caretaker_contact || "", notes || ""],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB Error", error: err.message });
      }
      res.status(201).json({ message: "Patient added", id: result.insertId });
    }
  );
};

exports.getAllPatients = (req, res) => {
  const sql = `
    SELECT p.id, p.user_id, p.name, p.age, p.gender, p.caretaker_contact, p.notes, u.email, u.role
    FROM patients p
    LEFT JOIN users u ON p.user_id = u.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error", error: err.message });
    }
    res.json(results);
  });
};

exports.getPatientById = (req, res) => {
  const sql = `
    SELECT p.id, p.user_id, p.name, p.age, p.gender, p.caretaker_contact, p.notes, u.email, u.role
    FROM patients p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(results[0]);
  });
};

exports.getMyPatientProfile = (req, res) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Forbidden: only patients can access this profile" });
  }

  const sql = `
    SELECT u.id AS user_id, u.name, u.email, u.role, p.id AS patient_id, p.age, p.gender, p.address, p.phone, p.caretaker_contact, p.notes
    FROM users u
    LEFT JOIN patients p ON p.user_id = u.id
    WHERE u.id = ?
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(results[0]);
  });
};

exports.updateMyPatientProfile = (req, res) => {
  const { name, age, gender, address, phone, caretaker_contact, notes } = req.body;

  const userUpdates = [];
  const userValues = [];

  if (name) {
    userUpdates.push("name = ?");
    userValues.push(name);
  }

  const updatePatientData = () => {
    const patientSql = `
      INSERT INTO patients (user_id, age, gender, address, phone, caretaker_contact, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        age = VALUES(age),
        gender = VALUES(gender),
        address = VALUES(address),
        phone = VALUES(phone),
        caretaker_contact = VALUES(caretaker_contact),
        notes = VALUES(notes)
    `;

    db.query(
      patientSql,
      [req.user.id, age || null, gender || "", address || "", phone || "", caretaker_contact || "", notes || ""],
      (patientErr) => {
        if (patientErr) {
          return res.status(500).json({ message: "Failed to update patient profile", error: patientErr.message });
        }
        res.json({ message: "Profile updated successfully" });
      }
    );
  };

  if (userUpdates.length > 0) {
    userValues.push(req.user.id);
    const userSql = `UPDATE users SET ${userUpdates.join(", ")} WHERE id = ?`;
    db.query(userSql, userValues, (userErr) => {
      if (userErr) {
        return res.status(500).json({ message: "Failed to update user profile", error: userErr.message });
      }
      updatePatientData();
    });
  } else {
    updatePatientData();
  }
};

exports.updatePatient = (req, res) => {
  const { name, age, gender, address, phone, caretaker_contact, notes } = req.body;
  const keys = [];
  const values = [];

  if (name) {
    keys.push("name = ?");
    values.push(name);
  }
  if (age !== undefined) {
    keys.push("age = ?");
    values.push(age);
  }
  if (gender) {
    keys.push("gender = ?");
    values.push(gender);
  }
  if (address) {
    keys.push("address = ?");
    values.push(address);
  }
  if (phone) {
    keys.push("phone = ?");
    values.push(phone);
  }
  if (caretaker_contact) {
    keys.push("caretaker_contact = ?");
    values.push(caretaker_contact);
  }
  if (notes) {
    keys.push("notes = ?");
    values.push(notes);
  }

  if (keys.length === 0) {
    return res.status(400).json({ message: "No patient fields provided to update" });
  }

  values.push(req.params.id);
  const sql = `UPDATE patients SET ${keys.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update patient", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient updated successfully" });
  });
};

exports.deletePatient = (req, res) => {
  const sql = "DELETE FROM patients WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete patient", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  });
};
