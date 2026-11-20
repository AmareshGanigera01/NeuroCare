// ============================================
// NeuroCare AI Dashboard System
// ============================================

console.log("Dashboard System Loaded");

// ============================================
// Greeting System
// ============================================

function loadGreeting()
{
    const greetingBox =
    document.getElementById("greetingText");

    if(!greetingBox)
    {
        return;
    }

    const hour =
    new Date().getHours();

    let greeting = "";

    if(hour < 12)
    {
        greeting = "Good Morning";
    }

    else if(hour < 18)
    {
        greeting = "Good Afternoon";
    }

    else
    {
        greeting = "Good Evening";
    }

    greetingBox.innerHTML =
    `
        ${greeting},
        Welcome to NeuroCare AI
    `;
}

loadGreeting();

// ============================================
// Live Clock
// ============================================

function updateClock()
{
    const clock =
    document.getElementById("liveClock");

    if(clock)
    {
        clock.innerHTML =
        new Date().toLocaleTimeString();
    }
}

setInterval(updateClock,1000);

// ============================================
// AI Health Tips
// ============================================

const healthTips =
[
    "Stay hydrated throughout the day.",
    "Brain exercises improve cognitive strength.",
    "Walking daily improves memory health.",
    "Sleep properly for better brain recovery.",
    "Social interaction supports emotional health."
];

function displayHealthTip()
{
    const random =
    Math.floor(
        Math.random() *
        healthTips.length
    );

    const tipBox =
    document.getElementById("healthTip");

    if(tipBox)
    {
        tipBox.innerHTML =
        healthTips[random];
    }
}

setInterval(displayHealthTip,10000);

displayHealthTip();

// ============================================
// Daily Progress
// ============================================

function generateProgress()
{
    return Math.floor(
        Math.random() * 30
    ) + 70;
}

function displayProgress()
{
    const progress =
    document.getElementById("dailyProgress");

    if(progress)
    {
        progress.innerHTML =
        generateProgress() + "%";
    }
}

displayProgress();