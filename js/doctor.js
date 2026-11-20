const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

function createCard(title, content, extraClass = "") {
  return `
    <div class="doctor-card glass-card ${extraClass}">
      <h3>${title}</h3>
      ${content}
    </div>
  `;
}

function renderPatients(patients) {
  const container = document.getElementById("doctorPatients");
  if (!container) return;
  if (!patients.length) {
    container.innerHTML = `<p>No patients assigned yet.</p>`;
    return;
  }
  container.innerHTML = patients
    .map(
      (patient) => `
        <div class="doctor-panel-card glass-card">
          <h3>${patient.name}</h3>
          <p><strong>Age:</strong> ${patient.age || "N/A"}</p>
          <p><strong>Gender:</strong> ${patient.gender || "N/A"}</p>
          <p><strong>Email:</strong> ${patient.email || "N/A"}</p>
          <p><strong>Phone:</strong> ${patient.phone || "N/A"}</p>
          <p><strong>Caretaker:</strong> ${patient.caretaker_contact || "N/A"}</p>
          <p>${patient.notes || "No additional notes."}</p>
        </div>
      `
    )
    .join("");
}

function renderAppointments(appointments) {
  const container = document.getElementById("doctorAppointments");
  if (!container) return;
  if (!appointments.length) {
    container.innerHTML = `<p>No appointments scheduled.</p>`;
    return;
  }
  container.innerHTML = appointments
    .map(
      (appt) => `
        <div class="doctor-panel-card glass-card">
          <h3>${appt.patient_name || "Unknown Patient"}</h3>
          <p><strong>Date:</strong> ${new Date(appt.scheduled_at).toLocaleString()}</p>
          <p><strong>Reason:</strong> ${appt.reason || "General check-up"}</p>
          <p><strong>Status:</strong> ${appt.status}</p>
        </div>
      `
    )
    .join("");
}

function renderEmergencies(emergencies) {
  const container = document.getElementById("doctorEmergencies");
  if (!container) return;
  if (!emergencies.length) {
    container.innerHTML = `<p>No active emergency alerts for your patients.</p>`;
    return;
  }
  container.innerHTML = emergencies
    .map(
      (alert) => `
        <div class="doctor-panel-card glass-card danger-card">
          <h3>${alert.patient_name || "Unknown Patient"}</h3>
          <p><strong>Event:</strong> ${alert.event}</p>
          <p><strong>Location:</strong> ${alert.location || "Unknown"}</p>
          <p><strong>Status:</strong> ${alert.status}</p>
          <p><strong>Raised:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
        </div>
      `
    )
    .join("");
}

function renderOverview(overview) {
  document.getElementById("overviewPatientCount").textContent = overview.patientCount || 0;
  document.getElementById("overviewAppointmentCount").textContent = overview.upcomingAppointments || 0;
  document.getElementById("overviewAlertCount").textContent = overview.activeAlerts || 0;
}

function renderReports(reports) {
  document.getElementById("reportPatients").textContent = reports.patientsAssigned || 0;
  document.getElementById("reportMemoryTests").textContent = reports.totalMemoryTests || 0;
  document.getElementById("reportAvgScore").textContent = reports.averageMemoryScore || 0;
}

function renderProfile(profile) {
  const container = document.getElementById("doctorProfile");
  if (!container) return;
  container.innerHTML = `
    <div class="profile-summary">
      <p><strong>Name:</strong> ${profile.name}</p>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Role:</strong> ${profile.role}</p>
      <p><strong>Joined:</strong> ${new Date(profile.created_at).toLocaleDateString()}</p>
    </div>
  `;
}

function handleUnauthorized(error) {
  const message = error.message || "Unauthorized access.";
  if (message.toLowerCase().includes("forbidden") || message.toLowerCase().includes("token")) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
  }
}

async function initializeDoctorDashboard() {
  try {
    const profile = await fetchJson("/auth/profile");
    if (profile.user.role !== "doctor") {
      return window.location.replace("login.html");
    }

    renderProfile(profile.user);
    localStorage.setItem("userRole", profile.user.role);

    const [overview, patients, appointments, emergencies, reports] = await Promise.all([
      fetchJson("/doctor/overview"),
      fetchJson("/doctor/patients"),
      fetchJson("/doctor/appointments"),
      fetchJson("/doctor/emergencies"),
      fetchJson("/doctor/reports"),
    ]);

    renderOverview(overview);
    renderPatients(patients);
    renderAppointments(appointments);
    renderEmergencies(emergencies);
    renderReports(reports);
  } catch (error) {
    console.error(error);
    handleUnauthorized(error);
  }
}

document.addEventListener("DOMContentLoaded", initializeDoctorDashboard);

