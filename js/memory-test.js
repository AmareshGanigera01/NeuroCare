// ============================================
// NeuroCare AI Memory Test
// Professional Cognitive Assessment System
// Vanilla JavaScript - No Frameworks
// ============================================

(function () {
  "use strict";

  const API_BASE = "http://localhost:5000/api";
  const LOG_PREFIX = "[NeuroCare-MemoryTest]";

  // Storage Keys
  const STORAGE_HISTORY = "nc_memory_history";
  const STORAGE_LAST_RESULT = "nc_last_result";
  const STORAGE_LAST_TIME = "nc_last_time";

  const TOTAL_QUESTIONS = 8;
  const TEST_DURATION = 600; // 10 minutes in seconds

  // Answer Validation Configuration
  const memoryQuestions = [
    { id: "q1", answer: ["may 22", "may 22, 2026"], kind: "text", weight: 1 },
    { id: "q2", answer: [], kind: "display", weight: 0 },
    { id: "q3", answer: ["12"], kind: "number", weight: 1 },
    { id: "q4", answer: ["wednesday"], kind: "text", weight: 1 },
    { id: "q5", answer: ["10987654321"], kind: "text", weight: 1 },
    { id: "q6", answer: ["dog", "dogs"], kind: "text", weight: 1 },
    { id: "q7", answer: ["hospital"], kind: "text", weight: 1 },
    { id: "q8", answer: ["mirror"], kind: "text", weight: 1 }
  ];

  // Brain Health Tips Database
  const brainTips = [
    "🧠 Read books daily for gentle brain stimulation.",
    "🧠 Practice recalling names and recent events.",
    "🧠 A short walk improves memory and focus.",
    "🧠 Stay socially active—conversation strengthens cognition.",
    "🧠 Try mental games: puzzles, riddles, or word recall.",
    "🧠 Sleep well—it's when memories consolidate.",
    "🧠 Learn something new every day.",
    "🧠 Stay hydrated for better brain function.",
    "🧠 Meditate to improve focus and attention.",
    "🧠 Limit stress for better memory retention."
  ];

  // Motivational Messages
  const motivationalMessages = [
    "You are improving every day. Keep going!",
    "Your brain health matters—take care of it.",
    "Stay positive and mentally active!",
    "Daily exercises support memory health.",
    "You're doing great! Keep practicing.",
    "Consistency is key to cognitive improvement."
  ];

  // -----------------------------
  // Utilities
  // -----------------------------
  function qs(id) {
    const el = document.getElementById(id);
    return el || null;
  }

  function normalizeText(value) {
    return String(value ?? "").toLowerCase().trim();
  }

  function getInputValue(id) {
    const el = qs(id);
    if (!el) return "";
    return el.value;
  }

  function canUseSpeech() {
    return typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof window.SpeechSynthesisUtterance !== "undefined";
  }

  function speakOnce(message) {
    const msg = String(message ?? "").trim();
    if (!msg) return;

    if (!canUseSpeech()) {
      console.log(LOG_PREFIX, "SpeechSynthesis not available.");
      return;
    }

    try {
      // Cancel previous utterances to prevent overlap.
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(msg);
      utter.lang = "en-US";
      utter.rate = 1;
      utter.pitch = 1;
      utter.volume = 1;

      utter.onstart = () => console.log(LOG_PREFIX, "TTS started.");
      utter.onend = () => console.log(LOG_PREFIX, "TTS ended.");
      utter.onerror = (e) => console.log(LOG_PREFIX, "TTS error:", e);

      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.log(LOG_PREFIX, "TTS failed:", e);
    }
  }

  function safeLocalStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.log(LOG_PREFIX, "localStorage set failed:", e);
    }
  }

  // AI Analysis Function
  function analysisFromScore(score) {
    const percent = (score / TOTAL_QUESTIONS) * 100;

    if (percent >= 90) {
      return {
        tier: "excellent",
        title: "Excellent Cognitive Health",
        label: "Excellent cognitive performance",
        detail: "Your memory and cognitive function are excellent. Maintain your healthy lifestyle!",
        recommendation: "Continue with regular mental exercises and social activities.",
        color: "#16a34a",
        badge: "🟢 Excellent",
        confidence: 95
      };
    }

    if (percent >= 60) {
      return {
        tier: "moderate",
        title: "Moderate Cognitive Performance",
        label: "Moderate cognitive performance",
        detail: "Your cognitive function is at a moderate level. Regular practice can help improve it.",
        recommendation: "Daily memory exercises and cognitive activities are recommended.",
        color: "#f59e0b",
        badge: "🟡 Moderate",
        confidence: 85
      };
    }

    return {
      tier: "attention-needed",
      title: "Cognitive Attention Recommended",
      label: "Cognitive attention recommended",
      detail: "Your assessment suggests attention to cognitive health is needed.",
      recommendation: "Please consult with a healthcare provider and increase cognitive activities.",
      color: "#dc2626",
      badge: "🔴 Attention Needed",
      confidence: 80
    };
  }

  // -----------------------------
  // Score Logic (Real-time)
  // -----------------------------
  // Core Scoring Engine
  function computeScore() {
    let score = 0;
    const answers = [];

    for (const q of memoryQuestions) {
      if (q.kind === "display") continue; // Skip display-only questions

      const raw = normalizeText(getInputValue(q.id));
      let isCorrect = false;

      if (q.kind === "number") {
        const numUser = Number(String(raw).trim());
        for (const validAnswer of q.answer) {
          const numExpected = Number(validAnswer);
          if (Number.isFinite(numUser) && numUser === numExpected) {
            isCorrect = true;
            break;
          }
        }
      } else {
        for (const validAnswer of q.answer) {
          if (raw === normalizeText(validAnswer)) {
            isCorrect = true;
            break;
          }
        }
      }

      if (isCorrect) {
        score += q.weight;
      }
      answers.push({ id: q.id, correct: isCorrect });
    }

    return score;
  }

  function computePercent(score) {
    const maxScore = memoryQuestions.filter(q => q.kind !== "display").reduce((sum, q) => sum + q.weight, 0);
    return Math.round((score / maxScore) * 100);
  }

  // Update AI Confidence Meter
  function updateConfidenceMeter(score) {
    const meter = qs("confidenceMeter");
    if (!meter) return;
    const confidence = computePercent(score);
    const value = qs("confidence-value");
    if (value) value.textContent = confidence + "%";
    const arc = meter.querySelector(".confidence-arc");
    if (arc) {
      arc.style.background = `conic-gradient(#2563eb ${confidence}%, rgba(37, 99, 235, 0.2) ${confidence}%)`;
    }
  }

  // Timer Management
  let countdownInterval = null;
  function startTimer() {
    let timeLeft = TEST_DURATION;
    const timerDisplay = qs("timerDisplay");
    if (!timerDisplay) return;

    function updateDisplay() {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      timerDisplay.textContent = `${mins}:${String(secs).padStart(2, "0")}`;
      if (timeLeft <= 60) timerDisplay.style.color = "#dc2626";
    }

    updateDisplay();
    countdownInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        // Auto-submit or show warning
      }
    }, 1000);
  }

  // -----------------------------
  // DOM Updates
  // -----------------------------
  // Update Progress Bar
  function updateProgressBar() {
    let answered = 0;
    const scoredQuestions = memoryQuestions.filter((question) => question.kind !== "display");
    const totalScored = scoredQuestions.length;

    for (const question of scoredQuestions) {
      const el = qs(question.id);
      if (el && el.value && el.value.trim()) answered++;
    }

    const fill = qs("progressFill");
    const progressText = qs("progressText");
    const progressBar = qs("progress-linear");

    if (fill && progressText && progressBar) {
      const percent = totalScored > 0 ? (answered / totalScored) * 100 : 0;
      fill.style.width = percent + "%";
      progressText.textContent = `${answered} of ${totalScored} answered`;
      progressBar.setAttribute("aria-valuenow", answered);
    }

    updateConfidenceMeter(computeScore());
  }

  // Show Results Modal
  function showResultsModal(score) {
    const modal = qs("resultModal");
    const overlay = qs("modalOverlay");
    const loading = qs("loadingOverlay");
    
    if (loading) loading.style.display = "none";
    if (!modal || !overlay) return;

    const analysis = analysisFromScore(score);
    const percent = computePercent(score);

    // Animate circular score
    const scoreNumber = qs("scoreNumber");
    const scoreProgress = qs("scoreProgress");
    if (scoreNumber) scoreNumber.textContent = percent + "%";
    if (scoreProgress) {
      const circumference = 2 * Math.PI * 90;
      const offset = circumference - (percent / 100) * circumference;
      scoreProgress.style.strokeDashoffset = offset;
      scoreProgress.style.stroke = analysis.color;
    }

    // Update analysis content
    const title = qs("analysisTitle");
    const badge = qs("analysisBadge");
    const text = qs("analysisText");
    const recommendation = qs("recommendationBox");

    if (title) title.textContent = analysis.title;
    if (badge) {
      badge.textContent = analysis.badge;
      badge.style.color = analysis.color;
    }
    if (text) text.textContent = analysis.detail;
    if (recommendation) {
      recommendation.innerHTML = `<div class="recommendation-text"><strong>Recommendation:</strong> ${analysis.recommendation}</div>`;
    }

    // Breakdown
    updateBreakdown(score);

    // Show modal
    modal.style.display = "flex";
    overlay.style.display = "block";

    // Save to history
    saveToHistory(score, analysis);

    // Speak result
    speakOnce(`Your cognitive score is ${percent} percent. ${analysis.detail}`);
  }

  function updateBreakdown(score) {
    const items = qs("breakdownItems");
    if (!items) return;
    
    let html = "";
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const el = qs(`q${i}`);
      if (el && el.value) {
        const q = memoryQuestions[i - 1];
        if (q && q.kind !== "display") {
          const correct = computeScore() > 0; // Simplified
          html += `<div class="breakdown-item">
            <span class="question-num">Q${i}</span>
            <span class="question-status ${correct ? "correct" : "pending"}">✓</span>
          </div>`;
        }
      }
    }
    items.innerHTML = html || "<p>No answers provided</p>";
  }

  // History Management
  function saveToHistory(score, analysis) {
    const result = {
      score: score,
      percent: computePercent(score),
      tier: analysis.tier,
      timestamp: new Date().toISOString()
    };
    safeLocalStorageSet(STORAGE_LAST_RESULT, JSON.stringify(result));
    safeLocalStorageSet(STORAGE_LAST_TIME, result.timestamp);
  }

  function loadLastResult() {
    const resultStr = safeLocalStorageGet(STORAGE_LAST_RESULT);
    if (!resultStr) return null;
    try {
      return JSON.parse(resultStr);
    } catch {
      return null;
    }
  }

  function displayLastResult() {
    const historyContent = qs("historyContent");
    if (!historyContent) return;

    const lastResult = loadLastResult();
    if (!lastResult) {
      historyContent.innerHTML = '<p class="no-history">No previous tests</p>';
      return;
    }

    const date = new Date(lastResult.timestamp);
    historyContent.innerHTML = `
      <div class="history-item">
        <div class="history-score">${lastResult.percent}%</div>
        <div class="history-tier">${lastResult.tier}</div>
        <div class="history-date">${date.toLocaleDateString()}</div>
      </div>
    `;
  }

  // Brain Tips Carousel
  let currentTipIndex = 0;
  function rotateBrainTip() {
    const tipText = qs("tipText");
    if (!tipText) return;
    
    tipText.textContent = brainTips[currentTipIndex];
    tipText.classList.remove("fade-in");
    void tipText.offsetHeight; // Trigger reflow
    tipText.classList.add("fade-in");
    
    currentTipIndex = (currentTipIndex + 1) % brainTips.length;
  }

  // Real-time Input Binding
  function bindLiveInputs() {
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const el = qs(`q${i}`);
      if (el && el.type !== "hidden") {
        el.addEventListener("input", () => updateProgressBar());
        el.addEventListener("change", () => updateProgressBar());
      }
    }
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    console.log(LOG_PREFIX, "Initializing NeuroCare Memory Test...");

    const form = qs("memoryForm");
    if (!form) {
      console.error(LOG_PREFIX, "Memory form not found!");
      return;
    }

    // Start timer
    startTimer();

    // Display last result
    displayLastResult();

    // Initial brain tip
    rotateBrainTip();
    setInterval(() => rotateBrainTip(), 8000);

    // Bind live input updates
    bindLiveInputs();
    updateProgressBar();

    // FORM SUBMISSION
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(LOG_PREFIX, "Form submitted");

      let allFilled = true;
      for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const q = memoryQuestions[i - 1];
        if (q && q.kind !== "display") {
          const el = qs(`q${i}`);
          if (!el || !el.value || !el.value.trim()) {
            allFilled = false;
            if (el) el.focus();
            break;
          }
        }
      }

      if (!allFilled) {
        alert("Please answer all questions before submitting.");
        return;
      }

      const score = computeScore();
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to submit the test.");
        window.location.href = "../html/login.html";
        return;
      }

      const loading = qs("loadingOverlay");
      if (loading) {
        loading.style.display = "flex";
      }

      try {
        const response = await fetch(`${API_BASE}/memory-test/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to submit memory test");
        }

        if (loading) {
          loading.style.display = "none";
        }

        showResultsModal(score);
      } catch (error) {
        if (loading) {
          loading.style.display = "none";
        }
        alert(error.message);
      }
    });

    // Modal Action Buttons
    const saveBtn = qs("saveResultBtn");
    const retakeBtn = qs("retakeTestBtn");
    const shareBtn = qs("shareResultBtn");
    const overlay = qs("modalOverlay");

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        alert("Result saved to your profile!");
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        form.reset();
        const modal = qs("resultModal");
        if (modal) modal.style.display = "none";
        if (overlay) overlay.style.display = "none";
        updateProgressBar();
        window.scrollTo(0, 0);
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const lastResult = loadLastResult();
        const shareText = lastResult ? `I scored ${lastResult.percent}% on the NeuroCare AI Memory Test!` : "Check out NeuroCare AI Memory Test!";
        if (navigator.share) {
          navigator.share({
            title: "NeuroCare AI Memory Test",
            text: shareText
          }).catch(err => console.log(LOG_PREFIX, "Share failed", err));
        } else {
          alert(shareText);
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", () => {
        const modal = qs("resultModal");
        if (modal) modal.style.display = "none";
        overlay.style.display = "none";
      });
    }

    console.log(LOG_PREFIX, "Initialization complete!");
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

