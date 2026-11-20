CREATE DATABASE IF NOT EXISTS alzheimer_ai_db;

USE alzheimer_ai_db;

-- =========================
-- USERS TABLE (AUTH)
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient','doctor','caregiver') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PATIENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  doctor_id INT DEFAULT NULL,
  age INT DEFAULT NULL,
  gender VARCHAR(20) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  caretaker_contact VARCHAR(100) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================
-- APPOINTMENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  status ENUM('SCHEDULED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- =========================
-- EMERGENCIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS emergencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  status ENUM('ACTIVE','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'ACTIVE',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- MEMORY TESTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS memory_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  accuracy FLOAT DEFAULT NULL,
  remarks TEXT DEFAULT NULL,
  taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


