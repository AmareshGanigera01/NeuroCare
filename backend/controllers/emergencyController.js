const db = require("../db");

exports.triggerEmergency = (req, res) => {
  const { event, location } = req.body;
  const userId = req.user.id;

  if (!event) {
    return res.status(400).json({ message: "Emergency event is required" });
  }

  const sql = `
    INSERT INTO emergencies (user_id, event, location)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [userId, event, location || null], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to trigger emergency", error: err.message });
    }
    res.status(201).json({ message: "Emergency triggered successfully", emergencyId: result.insertId });
  });
};

exports.getEmergencyHistory = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM emergencies WHERE user_id = ? ORDER BY timestamp DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch emergency history", error: err.message });
    }
    res.json(results);
  });
};

exports.getEmergencyById = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM emergencies WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch emergency", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Emergency not found" });
    }
    res.json(results[0]);
  });
};

exports.updateEmergencyStatus = (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE emergencies SET status = ? WHERE id = ?";

  db.query(sql, [status || "RESOLVED", req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update emergency status", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Emergency not found" });
    }
    res.json({ message: "Emergency status updated" });
  });
};

exports.deleteEmergency = (req, res) => {
  const sql = "DELETE FROM emergencies WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete emergency", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Emergency not found" });
    }
    res.json({ message: "Emergency deleted successfully" });
  });
};
