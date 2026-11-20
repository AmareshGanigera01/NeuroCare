// ==========================================
// NeuroCare AI - Advanced Voice Assistant
// ==========================================

console.log("NeuroCare AI Voice Assistant Loaded");

// ==========================================
// Elements
// ==========================================

const voiceStatus =
document.getElementById("voiceStatus") || null;

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
// Update Status
// ==========================================

function updateVoiceStatus(message)
{
    if(voiceStatus)
    {
        voiceStatus.innerHTML = message;
    }
}

// ==========================================
// Start Voice Assistant
// ==========================================

function startVoiceAssistant()
{
    speak(
        "Hello. NeuroCare AI Voice Assistant activated."
    );

    updateVoiceStatus(
        "Listening..."
    );

    startRecognition();
}

// ==========================================
// Speech Recognition
// ==========================================

function startRecognition()
{
    if(
        !(
            "webkitSpeechRecognition"
            in window
        )
    )
    {
        alert(
            "Speech Recognition Not Supported"
        );

        return;
    }

    const recognition =
    new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult =
    function(event)
    {
        const command =
        event.results[0][0]
        .transcript
        .toLowerCase();

        console.log(command);

        updateVoiceStatus(
            `Command: ${command}`
        );

        processCommand(command);
    };

    recognition.onerror =
    function()
    {
        updateVoiceStatus(
            "Voice Recognition Error"
        );

        speak(
            "Voice recognition error occurred."
        );
    };
}

// ==========================================
// Process Commands
// ==========================================

function processCommand(command)
{
    // ======================================
    // Medicine
    // ======================================

    if(
        command.includes("medicine")
    )
    {
        speak(
            "Your next medicine is scheduled at 8 PM."
        );
    }

    // ======================================
    // Emergency
    // ======================================

    else if(
        command.includes("emergency") ||
        command.includes("help")
    )
    {
        speak(
            "Emergency support activated."
        );

        setTimeout(() =>
        {
            window.location.href =
            "emergency.html";

        }, 2000);
    }

    // ======================================
    // Memory
    // ======================================

    else if(
        command.includes("memory")
    )
    {
        speak(
            "Opening memory analysis page."
        );

        setTimeout(() =>
        {
            window.location.href =
            "memory-test.html";

        }, 2000);
    }

    // ======================================
    // Doctor
    // ======================================

    else if(
        command.includes("doctor")
    )
    {
        speak(
            "Doctor consultation is available in your dashboard."
        );
    }

    // ======================================
    // Time
    // ======================================

    else if(
        command.includes("time")
    )
    {
        const currentTime =
        new Date()
        .toLocaleTimeString();

        speak(
            `Current time is ${currentTime}`
        );
    }

    // ======================================
    // Date
    // ======================================

    else if(
        command.includes("date")
    )
    {
        const currentDate =
        new Date()
        .toDateString();

        speak(
            `Today's date is ${currentDate}`
        );
    }

    // ======================================
    // Mood Support
    // ======================================

    else if(
        command.includes("sad") ||
        command.includes("stress") ||
        command.includes("anxious")
    )
    {
        speak(
            "Please stay calm. You are safe and supported."
        );
    }

    // ======================================
    // Greeting
    // ======================================

    else if(
        command.includes("hello") ||
        command.includes("hi")
    )
    {
        speak(
            "Hello. Hope you are having a peaceful day."
        );
    }

    // ======================================
    // Stop
    // ======================================

    else if(
        command.includes("stop")
    )
    {
        window.speechSynthesis.cancel();

        speak(
            "Voice assistant stopped."
        );
    }

    // ======================================
    // Default
    // ======================================

    else
    {
        speak(
            "I am analyzing your request."
        );
    }
}

// ==========================================
// Auto Welcome Voice
// ==========================================

window.addEventListener(
    "load",

    function()
    {
        setTimeout(() =>
        {
            speak(
                "Welcome to NeuroCare AI."
            );

        }, 1500);
    }
);

// ==========================================
// Motivation Messages
// ==========================================

const motivationMessages =
[
    "Stay positive and active.",
    "Daily exercise improves memory health.",
    "You are doing very well today.",
    "Please stay hydrated and healthy."
];

// ==========================================
// Random Motivation
// ==========================================

function randomMotivation()
{
    const random =
    Math.floor(
        Math.random() *
        motivationMessages.length
    );

    speak(
        motivationMessages[random]
    );
}

// ==========================================
// Every 5 Minutes
// ==========================================

setInterval(() =>
{
    randomMotivation();

}, 300000);

// ==========================================
// End
// ==========================================