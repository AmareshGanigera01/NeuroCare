// ==========================================
// NeuroCare AI Caregiver Dashboard
// ==========================================

console.log(
    "Caregiver Dashboard Activated"
);

// ==========================================
// Patient Data
// ==========================================

const patientData =
{
    name:
    "Ramesh Kumar",

    age:
    72,

    condition:
    "Moderate Alzheimer’s",

    cognitiveHealth:
    78,

    heartRate:
    74,

    medicineTaken:
    true,

    emergency:
    false,

    mood:
    "Calm"
};

// ==========================================
// Update Dashboard
// ==========================================

function updateDashboard()
{
    const patientName =
    document.getElementById(
        "patientName"
    );

    const cognitiveHealth =
    document.getElementById(
        "cognitiveHealth"
    );

    const heartRate =
    document.getElementById(
        "heartRate"
    );

    const medicineStatus =
    document.getElementById(
        "medicineStatus"
    );

    const moodStatus =
    document.getElementById(
        "moodStatus"
    );

    if(patientName)
    {
        patientName.innerHTML =
        patientData.name;
    }

    if(cognitiveHealth)
    {
        cognitiveHealth.innerHTML =
        patientData.cognitiveHealth
        + "%";
    }

    if(heartRate)
    {
        heartRate.innerHTML =
        patientData.heartRate
        + " BPM";
    }

    if(medicineStatus)
    {
        medicineStatus.innerHTML =
        patientData.medicineTaken
        ?
        "Completed"
        :
        "Pending";
    }

    if(moodStatus)
    {
        moodStatus.innerHTML =
        patientData.mood;
    }
}

// ==========================================
// Text To Speech
// ==========================================

function speakCaregiverMessage(
    message
)
{
    const speech =
    new SpeechSynthesisUtterance(
        message
    );

    speech.lang =
    "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(
        speech
    );
}

// ==========================================
// Emergency Alert
// ==========================================

function triggerEmergency()
{
    patientData.emergency =
    true;

    const message =
    `
        Emergency alert triggered.
        Patient requires immediate
        caregiver support.
    `;

    alert(message);

    speakCaregiverMessage(
        message
    );

    showNotification(
        "Emergency Alert",
        message
    );

    const emergencyBox =
    document.getElementById(
        "emergencyStatus"
    );

    if(emergencyBox)
    {
        emergencyBox.innerHTML =
        `
            <span class="danger-text">
                Emergency Active
            </span>
        `;
    }
}

// ==========================================
// Browser Notification
// ==========================================

function showNotification(
    title,
    body
)
{
    if(
        Notification.permission
        ===
        "granted"
    )
    {
        new Notification(
            title,
            {
                body: body
            }
        );
    }
}

// ==========================================
// Notification Permission
// ==========================================

if("Notification" in window)
{
    Notification.requestPermission();
}

// ==========================================
// Simulate Health Monitoring
// ==========================================

function simulateHealthUpdates()
{
    patientData.heartRate =
    Math.floor(
        Math.random() * 30
    ) + 60;

    patientData.cognitiveHealth =
    patientData.cognitiveHealth
    -
    Math.floor(
        Math.random() * 2
    );

    // Emergency Condition

    if(
        patientData.cognitiveHealth
        <
        60
    )
    {
        triggerEmergency();
    }

    updateDashboard();
}

// ==========================================
// Daily Reminder
// ==========================================

function dailyCareReminder()
{
    const reminder =
    `
        Reminder.
        Please check patient's
        medicine and hydration.
    `;

    console.log(reminder);

    speakCaregiverMessage(
        reminder
    );

    showNotification(
        "Caregiver Reminder",
        reminder
    );
}

// ==========================================
// AI Caregiver Insights
// ==========================================

function generateCaregiverInsight()
{
    const insightBox =
    document.getElementById(
        "caregiverInsight"
    );

    if(!insightBox)
    {
        return;
    }

    const insights =
    [
        `
        Patient mood appears stable today.
        `,

        `
        Medicine adherence improved.
        `,

        `
        Daily walking activity completed.
        `,

        `
        Cognitive exercises recommended.
        `
    ];

    const randomInsight =
    insights[
        Math.floor(
            Math.random() *
            insights.length
        )
    ];

    insightBox.innerHTML =
    `
        <h3>
            AI Caregiver Insight
        </h3>

        <p>
            ${randomInsight}
        </p>
    `;
}

// ==========================================
// Safe Zone Monitor
// ==========================================

function monitorSafeZone()
{
    const safe =
    Math.random();

    if(safe < 0.2)
    {
        const warning =
        `
            Warning.
            Patient may have exited
            safe zone.
        `;

        speakCaregiverMessage(
            warning
        );

        showNotification(
            "Safe Zone Warning",
            warning
        );
    }
}

// ==========================================
// Voice Guidance
// ==========================================

function voiceSupport()
{
    const message =
    `
        NeuroCare AI caregiver
        monitoring system active.
    `;

    speakCaregiverMessage(
        message
    );
}

// ==========================================
// Load Dashboard
// ==========================================

window.addEventListener(
    "load",
    function()
    {
        updateDashboard();

        generateCaregiverInsight();

        voiceSupport();
    }
);

// ==========================================
// Auto Monitoring
// ==========================================

setInterval(() =>
{
    simulateHealthUpdates();

}, 15000);

setInterval(() =>
{
    generateCaregiverInsight();

}, 12000);

setInterval(() =>
{
    dailyCareReminder();

}, 30000);

setInterval(() =>
{
    monitorSafeZone();

}, 20000);

// ==========================================
// End Of File
// ==========================================