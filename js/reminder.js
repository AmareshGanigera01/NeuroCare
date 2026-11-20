// ==========================================
// NeuroCare AI Medicine Reminder System
// ==========================================

console.log(
    "Medicine Reminder System Loaded"
);

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
// Browser Notification Permission
// ==========================================

if("Notification" in window)
{
    Notification.requestPermission();
}

// ==========================================
// Browser Notification
// ==========================================

function showNotification(message)
{
    if(
        Notification.permission ===
        "granted"
    )
    {
        new Notification(
            "NeuroCare AI Reminder",
            {
                body: message
            }
        );
    }
}

// ==========================================
// Medicine Taken
// ==========================================

function markTaken(button)
{
    const card =
    button.parentElement;

    const status =
    card.querySelector(
        ".status"
    ) || card.querySelector(
        ".medicine-status"
    );

    if(status)
    {
        status.innerHTML =
        "Taken";

        status.classList.remove(
            "pending-status"
        );

        status.classList.add(
            "taken-status"
        );

        status.classList.remove(
            "pending"
        );

        status.classList.add(
            "taken"
        );
    }

    button.innerHTML =
    "Completed";

    button.disabled = true;

    button.style.opacity = "0.7";

    const medicineName =
    card.querySelector("h2")
    .innerText;

    const message =
    `${medicineName} marked as taken successfully.`;

    speak(message);

    showNotification(message);
}

// ==========================================
// Start Reminder
// ==========================================

function startReminder()
{
    const reminderMessage =
    `
        Please take your scheduled
        medicine on time for better
        cognitive health.
    `;

    speak(reminderMessage);

    showNotification(
        "Medicine reminder activated."
    );

    alert(
        "AI Medicine Reminder Activated"
    );
}

// ==========================================
// Smart Auto Reminder
// ==========================================

const medicineMessages =
[
    "Please take your morning medicine.",
    "Medicine time reminder activated.",
    "Your health matters. Please take your medicine.",
    "Caregiver reminder. Medicine schedule pending."
];

// ==========================================
// Random Reminder
// ==========================================

function autoMedicineReminder()
{
    const random =
    Math.floor(
        Math.random() *
        medicineMessages.length
    );

    const message =
    medicineMessages[random];

    speak(message);

    showNotification(message);

    console.log(message);
}

// ==========================================
// Auto Reminder Every 4 Minutes
// ==========================================

setInterval(() =>
{
    autoMedicineReminder();

}, 240000);

// ==========================================
// Daily Summary
// ==========================================

function medicineSummary()
{
    const taken =
    document.querySelectorAll(
        ".taken-status"
    ).length;

    const total =
    document.querySelectorAll(
        ".medicine-card"
    ).length;

    console.log(
        `Medicines Taken:
        ${taken}/${total}`
    );
}

// ==========================================
// Summary Every 5 Minutes
// ==========================================

setInterval(() =>
{
    medicineSummary();

}, 300000);

// ==========================================
// Emergency Missed Reminder
// ==========================================

function checkMissedMedicines()
{
    const pending =
    document.querySelectorAll(
        ".pending-status"
    );

    if(pending.length >= 2)
    {
        const message =
        `
            Important.
            Multiple medicines are still pending.
        `;

        speak(message);

        showNotification(message);
    }
}

// ==========================================
// Check Every 6 Minutes
// ==========================================

setInterval(() =>
{
    checkMissedMedicines();

}, 360000);

// ==========================================
// Welcome Message
// ==========================================

window.addEventListener(
    "load",

    function()
    {
        setTimeout(() =>
        {
            speak(
                "Medicine reminder system activated."
            );

        }, 1500);
    }
);

// ==========================================
// End
// ==========================================