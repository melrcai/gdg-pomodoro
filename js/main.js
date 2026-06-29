const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

// colors 
const FOCUS_COLOR = "var(--google-blue)";
const SHORT_BREAK_COLOR = "var(--google-green)";
const LONG_BREAK_COLOR = "var(--google-red)";

// global state variables
let timeLeft = FOCUS_TIME;
let isRunning = false;
let currentMode = "focus";
let timerInterval = null;

// display elements
const timerDisplay = document.getElementById("timer-display");
const timerLabel = document.getElementById("timer-label");
const ringProgress = document.getElementById("ring-progress");

// control buttons
const startBtn = document.getElementById("toggle-btn");
const resetBtn = document.getElementById("reset-btn");
const toggleIcon = document.getElementById("toggle-icon");


// mode buttons
const focusBtn = document.getElementById("focus-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");

// timer display update function
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;  
  
  const formattedTime = minutes.toString().padStart(2, "0") 
  + ":" + seconds.toString().padStart(2, "0");

  timerDisplay.textContent = formattedTime;

  let totalTime = FOCUS_TIME; 
  if (currentMode === "short-break") {
    totalTime = SHORT_BREAK_TIME;
  } else if (currentMode === "long-break") {
    totalTime = LONG_BREAK_TIME;
  }
  
  const progress = 1 - (timeLeft / totalTime);
  ringProgress.style.strokeDashoffset = progress;   
}

// start timer
function startTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    toggleIcon.textContent = "play_arrow";
    timerLabel.textContent = "Paused"; 
    
  } else {
    isRunning = true;
    toggleIcon.textContent = "pause";
    timerLabel.textContent = currentMode === "focus" ? "Stay focused!" : "Take a break!";
    
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        toggleIcon.textContent = "play_arrow";
        timerLabel.textContent = "Time's up!";
        alert("Time's up! Take a break or start another session."); 
      }
    }, 1000);
  }
}

// reset timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  if (currentMode === "focus") timeLeft = FOCUS_TIME;
   else if (currentMode === "short-break") timeLeft = SHORT_BREAK_TIME;
   else if (currentMode === "long-break") timeLeft = LONG_BREAK_TIME;

  // Update the display
  updateTimerDisplay();
 
}


// mode switching function
function setMode(mode) {
  currentMode = mode;
  
  focusBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");
  longBreakBtn.classList.remove("active"); 
  
  const root = document.documentElement;
  
  if (mode === "focus") {
    timeLeft = FOCUS_TIME;
    focusBtn.classList.add("active");
    root.style.setProperty("--theme-primary", FOCUS_COLOR);
    timerLabel.textContent = "Time for a break!";
  } else if (mode === "short-break") {
    timeLeft = SHORT_BREAK_TIME;
    shortBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", SHORT_BREAK_COLOR);
    timerLabel.textContent = "Short break time!";
  } else if (mode === "long-break") {
    timeLeft = LONG_BREAK_TIME;
    longBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", LONG_BREAK_COLOR);
    timerLabel.textContent = "Time for a long break!";
  }
  
  clearInterval(timerInterval);
  isRunning = false;
  toggleIcon.textContent = "play_arrow"; 
  
  updateTimerDisplay();
}

// event listeners
startBtn.addEventListener("click", startTimer); 

resetBtn.addEventListener("click", resetTimer);

focusBtn.addEventListener("click", () => {
  setMode("focus");
});

shortBreakBtn.addEventListener("click", () => {
  setMode("short-break");
});

longBreakBtn.addEventListener("click", () => {
  setMode("long-break");
});

updateTimerDisplay();
