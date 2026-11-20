// ============================================
// Reports System
// ============================================

console.log("Reports System Loaded");

const reports =
[
    {
        patient: "Ramesh",
        score: "82%",
        status: "Stable"
    },

    {
        patient: "Suresh",
        score: "61%",
        status: "Needs Attention"
    },

    {
        patient: "Lakshmi",
        score: "91%",
        status: "Healthy"
    }
];

const reportsGrid =
document.getElementById("reportsGrid");

// ============================================
// Load Reports
// ============================================

function loadReports()
{
    reports.forEach((report)=>
    {
        reportsGrid.innerHTML +=
        `
            <div class="report-card">

                <h2>
                    ${report.patient}
                </h2>

                <p>
                    Cognitive Score:
                    ${report.score}
                </p>

                <p>
                    Status:
                    ${report.status}
                </p>

            </div>
        `;
    });
}

loadReports();
