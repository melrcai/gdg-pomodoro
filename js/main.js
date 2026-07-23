const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

// colors 
const FOCUS_COLOR = "var(--google-focus)";
const SHORT_BREAK_COLOR = "var(--google-s-break)";
const LONG_BREAK_COLOR = "var(--google-l-break)";

// global state variables
let timeLeft = FOCUS_TIME;
let isRunning = false;
let currentMode = "focus";
let timerInterval = null;
const TIMER_DONE_SOUND = "./assets/timer-done.mp3";
let timerDoneAudio = null;

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

// add task button
const addTaskBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// task input and list elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksUl = document.getElementById('tasks-ul');
const countTasks = document.querySelectorAll(".task-item").length; 

// iteration
const iterationDisplay = document.getElementById("iteration-count");

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

function playTimerDoneSound() {
  if (typeof Audio === "undefined") return; 

  if (!timerDoneAudio) {  
    timerDoneAudio = new Audio(TIMER_DONE_SOUND); 
    timerDoneAudio.preload = "auto"; 
    timerDoneAudio.loop = true; 
  }

  timerDoneAudio.currentTime = 0;
  timerDoneAudio.play().catch(() => {
    console.warn(`Could not play timer sound from ${TIMER_DONE_SOUND}`);
  });
}

function stopTimerDoneSound() {
  if (timerDoneAudio) {
    timerDoneAudio.pause();
    timerDoneAudio.currentTime = 0; 
  }
} 

function startTimer() {
  if (!isRunning && timeLeft === 0) {
    stopTimerDoneSound();
    toggleIcon.textContent = "play_arrow";
    timerLabel.textContent = "Paused";
    return;
  }

  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    toggleIcon.textContent = "play_arrow";
    timerLabel.textContent = "Paused"; 
    stopTimerDoneSound(); 
    
  } else {
    stopTimerDoneSound();
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
        timerLabel.textContent = "Time's up!";
        playTimerDoneSound();
        incrementIteration();
      }
    }, 1000);
  }
}

// reset timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  stopTimerDoneSound();
  if (currentMode === "focus") timeLeft = FOCUS_TIME;
   else if (currentMode === "short-break") timeLeft = SHORT_BREAK_TIME;
   else if (currentMode === "long-break") timeLeft = LONG_BREAK_TIME;
  toggleIcon.textContent = "play_arrow";
  timerLabel.textContent = currentMode === "focus" ? "Time for a break!" : "Take a break!";

  updateTimerDisplay();
}

// task count
function updateTaskCount() {
  const taskCount = document.querySelectorAll('#tasks-ul li').length;
  document.getElementById('task-count').textContent = `Tasks: ${taskCount}`;

  if (taskCount === 0) {
  document.getElementById('task-count').textContent = `No Active Tasks: ${taskCount}`;
  }
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

    addTaskBtn.classList.remove('hidden');
  } else if (mode === "short-break") {
    timeLeft = SHORT_BREAK_TIME;
    shortBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", SHORT_BREAK_COLOR);
    timerLabel.textContent = "Short break time!";

    addTaskBtn.classList.add('hidden');
  } else if (mode === "long-break") {
    timeLeft = LONG_BREAK_TIME;
    longBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", LONG_BREAK_COLOR);
    timerLabel.textContent = "Time for a long break!";

    addTaskBtn.classList.add('hidden');
  }
  
  clearInterval(timerInterval);
  isRunning = false;
  stopTimerDoneSound();
  toggleIcon.textContent = "play_arrow"; 
  
  updateTimerDisplay();
}

// event listeners
startBtn.addEventListener("click", startTimer); 

resetBtn.addEventListener("click", resetTimer);

//*  mode buttons 
focusBtn.addEventListener("click", () => {
  setMode("focus");
});

shortBreakBtn.addEventListener("click", () => {
  setMode("short-break");
});

longBreakBtn.addEventListener("click", () => {
  setMode("long-break");
});

addTaskBtn.addEventListener("click", () => {
  taskList.classList.toggle('hidden');
});

//* task form submission
taskForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const taskText = taskInput.value.trim();

    if (taskText !== "") {
      const newLi = document.createElement('li');
      newLi.classList.add('task-item');

      newLi.addEventListener('click', () => {
        const currentlyActive = tasksUl.querySelector('.active');
        if (currentlyActive && currentlyActive !== newLi) {
            currentlyActive.classList.remove('active');
        }
        newLi.classList.toggle('active');
            if (newLi.classList.contains('active')) {
              tasksUl.prepend(newLi);
            }
        });

        newLi.innerHTML = `
            <div class="task-main">
              <span class="task-text">${taskText}</span>
              <span class="iteration-count">0</span>
                <span class="task-status" aria-hidden="true">○</span>
            </div>
            <button class="delete-btn">&times;</button>
        `;

        tasksUl.appendChild(newLi);
        taskInput.value = '';

        updateTaskCount();
    }
});

//* delete task event delegation 
tasksUl.addEventListener('click', (event) => {
  const clickedElement = event.target; // event.target is the element that was clicked
  if (clickedElement.classList.contains('delete-btn')) {
    const liToDelete = clickedElement.closest('li');
    if (liToDelete) {
      liToDelete.remove()

      updateTaskCount();
    }
  }
});

//* iteration count
iterationDisplay.textContent = "Iteration: 0"; 
let iterationCount = 0;
function incrementIteration() {
  if (currentMode === "focus" && timeLeft === 0) {
    iterationCount++;
    iterationDisplay.textContent = `Iteration: ${iterationCount}`;

    const activeTask = tasksUl.querySelector('li.active');
    if (activeTask) {
      const sessionCount = activeTask.querySelector('.iteration-count');
      const taskStatus = activeTask.querySelector('.task-status');
      const nextCount = parseInt(sessionCount.textContent, 10) + 1;

      sessionCount.textContent = String(nextCount);
      taskStatus.textContent = '✓';
      activeTask.classList.add('completed');
    }
  }
}    

updateTimerDisplay();
