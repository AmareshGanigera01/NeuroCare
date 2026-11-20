const API_BASE = "http://localhost:5000/api";

const registerForm = document.getElementById("registerForm");
const registerStatus = document.getElementById("registerStatus");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      registerStatus.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      registerStatus.textContent = "Registration successful. Redirecting to login...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (error) {
      registerStatus.textContent = error.message;
    }
  });
}
