// ==========================================
// NeuroCare AI Chatbot System
// ==========================================

console.log(
    "NeuroCare AI Chatbot Activated"
);

// ==========================================
// Chat Elements
// ==========================================

const chatBox =
document.getElementById("chatBox");

const userInput =
document.getElementById("userInput");

// ==========================================
// Add Message
// ==========================================

function addMessage(
    message,
    sender
)
{
    const messageDiv =
    document.createElement("div");

    messageDiv.classList.add(
        sender === "user"
        ?
        "user-message"
        :
        "bot-message"
    );

    messageDiv.innerHTML =
    message;

    chatBox.appendChild(
        messageDiv
    );

    // Auto Scroll

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

// ==========================================
// AI Typing Effect
// ==========================================

function showTyping()
{
    const typing =
    document.createElement("div");

    typing.classList.add(
        "bot-message"
    );

    typing.id = "typing";

    typing.innerHTML =
    "AI is typing...";

    chatBox.appendChild(
        typing
    );

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

// ==========================================
// Remove Typing
// ==========================================

function removeTyping()
{
    const typing =
    document.getElementById(
        "typing"
    );

    if(typing)
    {
        typing.remove();
    }
}

// ==========================================
// Text To Speech
// ==========================================

function speakMessage(message)
{
    const speech =
    new SpeechSynthesisUtterance(
        message
    );

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(
        speech
    );
}

// ==========================================
// Generate AI Response
// ==========================================

function generateAIResponse(
    message
)
{
    message =
    message.toLowerCase();

    // Medicine

    if(
        message.includes("medicine")
    )
    {
        return `
            Please take your medicine
            on time for better
            cognitive health.
        `;
    }

    // Memory

    else if(
        message.includes("memory")
    )
    {
        return `
            Daily memory exercises
            improve brain activity
            and cognitive stability.
        `;
    }

    // Emergency

    else if(
        message.includes("emergency")
        ||
        message.includes("help")
    )
    {
        triggerEmergencyAlert();

        return `
            Emergency support activated.
            Caregiver has been notified.
        `;
    }

    // Sad

    else if(
        message.includes("sad")
        ||
        message.includes("stress")
    )
    {
        return `
            Stay calm and relaxed.
            You are safe and supported.
        `;
    }

    // Time

    else if(
        message.includes("time")
    )
    {
        return `
            Current time is:
            ${new Date()
            .toLocaleTimeString()}
        `;
    }

    // Date

    else if(
        message.includes("date")
    )
    {
        return `
            Today's date is:
            ${new Date()
            .toDateString()}
        `;
    }

    // Caregiver

    else if(
        message.includes("caregiver")
    )
    {
        return `
            Connecting with caregiver
            support system.
        `;
    }

    // Doctor

    else if(
        message.includes("doctor")
    )
    {
        return `
            Your doctor appointment
            is scheduled tomorrow.
        `;
    }

    // Greeting

    else if(
        message.includes("hello")
        ||
        message.includes("hi")
    )
    {
        return `
            Hello 👋
            How are you feeling today?
        `;
    }

    // Default

    else
    {
        return `
            I am analyzing your request.
            Please stay healthy and safe.
        `;
    }
}

// ==========================================
// Send Message
// ==========================================

function sendMessage()
{
    const message =
    userInput.value.trim();

    if(message === "")
    {
        return;
    }

    // User Message

    addMessage(
        message,
        "user"
    );

    userInput.value = "";

    // AI Typing

    showTyping();

    // Simulate AI Delay

    setTimeout(() =>
    {
        removeTyping();

        const response =
        generateAIResponse(
            message
        );

        addMessage(
            response,
            "bot"
        );

        speakMessage(
            response
        );

    }, 1500);
}

// ==========================================
// Enter Key Send
// ==========================================

userInput.addEventListener(
    "keypress",
    function(event)
    {
        if(event.key === "Enter")
        {
            sendMessage();
        }
    }
);

// ==========================================
// Quick Action Buttons
// ==========================================

function quickMessage(text)
{
    userInput.value = text;

    sendMessage();
}

// ==========================================
// Voice Recognition
// ==========================================

function startVoiceRecognition()
{
    if(
        'webkitSpeechRecognition'
        in window
    )
    {
        const recognition =
        new webkitSpeechRecognition();

        recognition.lang =
        "en-US";

        recognition.start();

        recognition.onresult =
        function(event)
        {
            const voiceText =
            event.results[0][0]
            .transcript;

            userInput.value =
            voiceText;

            sendMessage();
        };

        recognition.onerror =
        function()
        {
            alert(
                "Voice recognition error."
            );
        };
    }

    else
    {
        alert(
            "Voice recognition not supported."
        );
    }
}

// ==========================================
// Emergency Alert
// ==========================================

function triggerEmergencyAlert()
{
    console.log(
        "Emergency Alert Triggered"
    );

    // Browser Notification

    if(
        Notification.permission
        ===
        "granted"
    )
    {
        new Notification(
            "NeuroCare Emergency",
            {
                body:
                "Emergency assistance activated."
            }
        );
    }

    // Voice Alert

    speakMessage(
        "Emergency support activated."
    );
}

// ==========================================
// Notification Permission
// ==========================================

if("Notification" in window)
{
    Notification.requestPermission();
}

// ==========================================
// AI Welcome Message
// ==========================================

window.addEventListener(
    "load",
    function()
    {
        setTimeout(() =>
        {
            speakMessage(
                "Welcome to NeuroCare AI chatbot support."
            );

        }, 1000);
    }
);

// ==========================================
// End Of File
// ==========================================

