let num1, num2, correct;

let score = 0;
let aiScore = 0;
let lives = 3;

let timeLeft;
let timer;
let aiTimer;

// Generate Question
function generateQuestion() {
  const mode = document.getElementById("mode").value;

  if (mode === "easy") {
    num1 = rand(0, 50);
    num2 = rand(0, 50);
    correct = num1 + num2;
  }

  if (mode === "normal") {
    num1 = rand(0, 100);
    num2 = rand(0, 100);
    if (num2 > num1) [num1, num2] = [num2, num1];
    correct = num1 - num2;
  }

  if (mode === "hard") {
    num1 = rand(0, 20);
    num2 = rand(0, 20);
    correct = num1 * num2;
  }

  document.getElementById("question").innerText =
    `${num1} ${getSymbol(mode)} ${num2}`;

  nextRound();
}

// Timer
function resetTimer() {
  clearInterval(timer);

  const mode = document.getElementById("mode").value;

  if (mode === "easy") timeLeft = 12;
  if (mode === "normal") timeLeft = 9;
  if (mode === "hard") timeLeft = 6;

  updateTimerUI();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timer);
      clearTimeout(aiTimer);
      loseLife("⏰ Time Up!");
      nextQuestion();
    }
  }, 1000);
}

// AI Logic
function aiPlay() {
  clearTimeout(aiTimer);

  const mode = document.getElementById("mode").value;

  let aiSpeed, accuracy;

  if (mode === "easy") {
    aiSpeed = rand(3000, 6000);
    accuracy = 0.6;
  }

  if (mode === "normal") {
    aiSpeed = rand(2000, 4000);
    accuracy = 0.75;
  }

  if (mode === "hard") {
    aiSpeed = rand(1000, 2500);
    accuracy = 0.9;
  }

  aiTimer = setTimeout(() => {
    if (Math.random() < accuracy) {
      aiScore++;
      document.getElementById("aiScore").innerText = aiScore;
      document.getElementById("result").innerText = "🤖 AI got it!";

      if (aiScore >= 10) {
        gameOver("🤖 AI Wins!");
        return;
      }

      nextQuestion();
    }
  }, aiSpeed);
}

// Player Answer
function checkAnswer() {
  clearTimeout(aiTimer);

  const user = Number(document.getElementById("answer").value);

  if (user === correct) {
    score++;
    document.getElementById("score").innerText = score;
    document.getElementById("result").innerText = "✅ You got it!";

    if (score >= 10) {
      gameOver("🏆 You Win!");
      return;
    }

  } else {
    loseLife("❌ Wrong!");
  }

  nextQuestion();
}

// Lose Life
function loseLife(msg) {
  lives--;
  document.getElementById("lives").innerText = lives;
  document.getElementById("result").innerText = msg;

  if (lives <= 0) {
    gameOver("💀 Game Over!");
  }
}

// Next Question
function nextQuestion() {
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
  generateQuestion();
}

// Round Start
function nextRound() {
  resetTimer();
  aiPlay();
}

// Game Over
function gameOver(msg) {
  clearInterval(timer);
  clearTimeout(aiTimer);
  alert(msg + " Final Score: " + score + " vs AI: " + aiScore);
  location.reload();
}

// Helpers
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSymbol(mode) {
  if (mode === "easy") return "+";
  if (mode === "normal") return "-";
  if (mode === "hard") return "×";
}

function updateTimerUI() {
  const el = document.getElementById("timer");
  el.innerText = timeLeft;

  if (timeLeft <= 3) {
    el.classList.add("red");
  } else {
    el.classList.remove("red");
  }
}

// Enter key support
document.getElementById("answer").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Start Game
generateQuestion();