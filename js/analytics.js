// ============================================
// Analytics System
// ============================================

console.log("Analytics Loaded");

// ============================================
// Random Analytics Generator
// ============================================

function randomPercentage()
{
    return Math.floor(
        Math.random() * 30
    ) + 70;
}

// ============================================
// Update Analytics
// ============================================

function updateAnalytics()
{
    const memory =
    document.getElementById("memoryValue");

    const medicine =
    document.getElementById("medicineValue");

    if(memory)
    {
        memory.innerHTML =
        randomPercentage() + "%";
    }

    if(medicine)
    {
        medicine.innerHTML =
        randomPercentage() + "%";
    }
}

setInterval(updateAnalytics,5000);

updateAnalytics();