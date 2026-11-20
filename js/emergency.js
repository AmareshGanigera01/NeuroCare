const API_BASE = "http://localhost:5000/api";

// ==========================================
// NeuroCare AI Emergency System
// ==========================================

console.log(
    "Emergency System Activated"
);

// ==========================================
// Emergency Logs
// ==========================================

const emergencyLogs = [];

// ==========================================
// Text To Speech
// ==========================================

function speak(message)
{
    window.speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

// ==========================================
// Browser Notification
// ==========================================

if("Notification" in window)
{
    Notification.requestPermission();
}

function showNotification(message)
{
    if(
        Notification.permission ===
        "granted"
    )
    {
        new Notification(
            "NeuroCare AI SOS",
            {
                body: message
            }
        );
    }
}

// ==========================================
// Detect GPS Location
// ==========================================

function detectLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation
        .getCurrentPosition(

        function(position)
        {
            const latitude =
            position.coords.latitude;

            const longitude =
            position.coords.longitude;

            document
            .getElementById(
                "locationText"
            )
            .innerHTML =

            `
                Latitude:
                ${latitude}

                <br><br>

                Longitude:
                ${longitude}
            `;
        },

        function()
        {
            document
            .getElementById(
                "locationText"
            )
            .innerHTML =

            "Location access denied.";
        });
    }

    else
    {
        document
        .getElementById(
            "locationText"
        )
        .innerHTML =

        "GPS not supported.";
    }
}

// ==========================================
// Run GPS
// ==========================================

detectLocation();

// ==========================================
// Siren Sound
// ==========================================

function playSiren()
{
    const audio =
    new Audio(
        "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );

    audio.play();
}

// ==========================================
// Activate SOS
// ==========================================

async function activateSOS()
{
    const message =
    `
        Emergency SOS activated.
        Caregiver and emergency team alerted.
    `;

    const statusElement = document.getElementById("sosStatus");
    if (statusElement) {
      statusElement.innerHTML = "<p>Triggering emergency alert...</p>";
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Not authenticated. Please login first.");
        }

        const response = await fetch(`${API_BASE}/emergency/trigger`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                event: "sos_button_pressed",
                location: document.getElementById("locationText")?.innerText || null,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Emergency trigger failed");
        }

        speak(message);
        showNotification(message);
        playSiren();

        if (statusElement) {
          statusElement.innerHTML = `
            <h2>SOS ACTIVATED</h2>
            <p>Emergency support notified successfully.</p>
          `;
        }

        emergencyLogs.push({
            time: new Date().toLocaleString(),
            message: "Emergency SOS Triggered",
            detail: data.message,
        });

        displayLogs();
        alert("Emergency SOS Activated! Help is on the way.");
    } catch (error) {
        console.error(error);
        if (statusElement) {
          statusElement.innerHTML = `<p style="color:#d00;">${error.message}</p>`;
        }
        alert(error.message);
    }
}

// ==========================================
// Display Logs
// ==========================================

function displayLogs()
{
    const logList =
    document.getElementById(
        "logList"
    );

    logList.innerHTML = "";

    emergencyLogs.forEach(
    (log) =>
    {
        const li =
        document.createElement("li");

        li.innerHTML =

        `
            ${log.time}
            <br>
            ${log.message}
        `;

        logList.appendChild(li);
    });
}

// ==========================================
// AI Safety Monitoring
// ==========================================

function safetyMonitoring()
{
    const random =
    Math.random();

    if(random < 0.2)
    {
        const warning =
        `
            Patient may require
            immediate attention.
        `;

        speak(warning);

        showNotification(warning);

        console.log(warning);
    }
}

// ==========================================
// Every 5 Minutes
// ==========================================

setInterval(() =>
{
    safetyMonitoring();

}, 300000);

// ==========================================
// Welcome Alert
// ==========================================

window.addEventListener(
    "load",

    function()
    {
        setTimeout(() =>
        {
            speak(
                "Emergency monitoring system activated."
            );

        }, 1200);
    }
);

// ==========================================
// End
// ==========================================