// ==========================================
// NeuroCare AI Appointment System
// ==========================================

console.log(
    "Appointment System Activated"
);

// ==========================================
// Appointment Data
// ==========================================

const appointments = [];

// ==========================================
// Form
// ==========================================

const appointmentForm =
document.getElementById(
    "appointmentForm"
);

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
// Book Appointment
// ==========================================

appointmentForm.addEventListener(
    "submit",
    function(event)
    {
        event.preventDefault();

        const patientName =
        document.getElementById(
            "patientName"
        ).value;

        const doctorName =
        document.getElementById(
            "doctorName"
        ).value;

        const appointmentDate =
        document.getElementById(
            "appointmentDate"
        ).value;

        const appointmentTime =
        document.getElementById(
            "appointmentTime"
        ).value;

        const appointment =
        {
            patientName,
            doctorName,
            appointmentDate,
            appointmentTime
        };

        appointments.push(
            appointment
        );

        displayAppointments();

        const successMessage =
        `
            Appointment booked
            successfully.
        `;

        alert(successMessage);

        speakMessage(
            successMessage
        );

        showNotification(
            "Appointment Booked",
            successMessage
        );

        appointmentForm.reset();
    }
);

// ==========================================
// Display Appointments
// ==========================================

function displayAppointments()
{
    const appointmentList =
    document.getElementById(
        "appointmentList"
    );

    if(!appointmentList)
    {
        return;
    }

    let html = "";

    appointments.forEach(
    (appointment) =>
    {
        html +=
        `
            <div class="appointment-card">

                <h3>
                    ${appointment.patientName}
                </h3>

                <p>
                    Doctor:
                    ${appointment.doctorName}
                </p>

                <p>
                    Date:
                    ${appointment.appointmentDate}
                </p>

                <p>
                    Time:
                    ${appointment.appointmentTime}
                </p>

                <span class="appointment-status">
                    Scheduled
                </span>

            </div>
        `;
    });

    appointmentList.innerHTML =
    html;
}

// ==========================================
// Emergency Appointment
// ==========================================

function bookEmergencyAppointment()
{
    const message =
    `
        Emergency appointment
        request submitted.
    `;

    alert(message);

    speakMessage(message);

    showNotification(
        "Emergency Consultation",
        message
    );
}

// ==========================================
// AI Appointment Reminder
// ==========================================

function appointmentReminder()
{
    if(appointments.length > 0)
    {
        const nextAppointment =
        appointments[0];

        const reminder =
        `
            Upcoming appointment for
            ${nextAppointment.patientName}
            with
            ${nextAppointment.doctorName}.
        `;

        console.log(reminder);

        speakMessage(reminder);

        showNotification(
            "Appointment Reminder",
            reminder
        );
    }
}

// ==========================================
// Doctor Availability
// ==========================================

function checkDoctorAvailability()
{
    console.log(
        "Doctors available for consultation."
    );
}

// ==========================================
// Appointment History
// ==========================================

function showAppointmentHistory()
{
    console.log(
        "Appointment History:",
        appointments
    );
}

// ==========================================
// AI Health Suggestion
// ==========================================

function aiHealthSuggestion()
{
    const suggestions =
    [
        `
        Regular memory exercises
        are recommended.
        `,

        `
        Maintain proper hydration
        and sleep schedule.
        `,

        `
        Daily medicine adherence
        improves cognitive stability.
        `
    ];

    const randomSuggestion =
    suggestions[
        Math.floor(
            Math.random() *
            suggestions.length
        )
    ];

    console.log(
        randomSuggestion
    );

    speakMessage(
        randomSuggestion
    );
}

// ==========================================
// Auto Systems
// ==========================================

setInterval(() =>
{
    appointmentReminder();

}, 30000);

setInterval(() =>
{
    aiHealthSuggestion();

}, 45000);

// ==========================================
// End Of File
// ==========================================