const API_BASE = "http://localhost:5000/api";

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../html/login.html";
}

async function enforcePatientRole() {
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unauthorized");
    }
    if (data.user.role === "doctor") {
      window.location.href = "doctor-dashboard.html";
      return;
    }
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "../html/login.html";
  }
}

async function loadProfile() {
  try {
    const response = await fetch(`${API_BASE}/patients/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load profile");
    }

    document.getElementById("profileName").value = data.name || "";
    document.getElementById("profileAge").value = data.age || "";
    document.getElementById("profileGender").value = data.gender || "";
    document.getElementById("profileAddress").value = data.address || "";
    document.getElementById("profilePhone").value = data.phone || "";
    document.getElementById("profileStatus").textContent = "Profile loaded successfully.";
  } catch (error) {
    console.error(error);
    document.getElementById("profileStatus").textContent = error.message;
    if (error.message.includes("token") || error.message.includes("Unauthorized")) {
      localStorage.removeItem("token");
      window.location.href = "../html/login.html";
    }
  }
}

async function updateProfile(event) {
  event.preventDefault();
  const name = document.getElementById("profileName").value.trim();
  const ageValue = document.getElementById("profileAge").value.trim();
  const age = ageValue ? Number(ageValue) : undefined;
  const gender = document.getElementById("profileGender").value.trim();
  const address = document.getElementById("profileAddress").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();

  const payload = {};
  if (name) payload.name = name;
  if (ageValue) payload.age = age;
  if (gender) payload.gender = gender;
  if (address) payload.address = address;
  if (phone) payload.phone = phone;

  try {
    const response = await fetch(`${API_BASE}/patients/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    document.getElementById("profileStatus").textContent = "Profile updated successfully.";
  } catch (error) {
    console.error(error);
    document.getElementById("profileStatus").textContent = error.message;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", updateProfile);
  }
  enforcePatientRole().then(loadProfile);
});
