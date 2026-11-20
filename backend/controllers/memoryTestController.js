const db = require("../db");

exports.submitMemoryTest = (req, res) => {
  const userId = req.user.id;
  const { score, accuracy = null, remarks = null } = req.body;

  if (typeof score !== "number") {
    return res.status(400).json({ message: "Score must be a number" });
  }

  const sql = `
    INSERT INTO memory_tests (user_id, score, accuracy, remarks)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [userId, score, accuracy, remarks], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save memory test", error: err.message });
    }

    res.status(201).json({ message: "Memory test saved successfully", testId: result.insertId });
  });
};

exports.getAllMemoryTests = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM memory_tests WHERE user_id = ? ORDER BY taken_at DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching tests", error: err.message });
    }
    res.json(results);
  });
};

exports.getLatestMemoryTest = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM memory_tests WHERE user_id = ? ORDER BY taken_at DESC LIMIT 1";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching latest test", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No tests found" });
    }
    res.json(results[0]);
  });
};

exports.getMemoryTestById = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM memory_tests WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching memory test", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(results[0]);
  });
};

exports.deleteMemoryTest = (req, res) => {
  const userId = req.user.id;
  const sql = "DELETE FROM memory_tests WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting memory test", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json({ message: "Memory test deleted successfully" });
  });
};
