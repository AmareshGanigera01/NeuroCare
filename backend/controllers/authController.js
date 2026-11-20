const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const tokenExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: tokenExpiresIn }
  );
};

exports.registerUser = (req, res) => {
  const { name, email, password, role = "patient" } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already registered" });
      }
      return res.status(500).json({ message: "Registration failed", error: err.message });
    }

    const userId = result.insertId;
    if (role === "patient") {
      const patientSql = "INSERT INTO patients (user_id) VALUES (?)";
      db.query(patientSql, [userId], (patientErr) => {
        if (patientErr) {
          return res.status(500).json({ message: "Registration failed", error: patientErr.message });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
      return;
    }

    res.status(201).json({ message: "User registered successfully" });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Login error", error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

exports.logoutUser = (req, res) => {
  res.json({ message: "Logout successful" });
};

exports.getUserProfile = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = results[0];
    res.json({ user });
  });
};

exports.updateUserProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  const updates = [];
  const values = [];

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (password) {
    updates.push("password = ?");
    values.push(bcrypt.hashSync(password, saltRounds));
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No profile fields provided to update" });
  }

  values.push(userId);
  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
    res.json({ message: "Profile updated successfully" });
  });
};
