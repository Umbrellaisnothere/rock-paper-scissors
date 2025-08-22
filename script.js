document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const nameScreen = document.getElementById("name-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const sidebar = document.getElementById("sidebar");

  const startBtn = document.getElementById("start-btn");
  const skipIntroBtn = document.getElementById("skip-intro-btn");
  const submitNameBtn = document.getElementById("submit-name-btn");
  const restartBtn = document.getElementById("restart-btn");

  const playerNameInput = document.getElementById("player-name");
  const greeting = document.getElementById("greeting");
  const playerScoreText = document.getElementById("player-score");
  const computerScoreText = document.getElementById("computer-score");
  const resultText = document.getElementById("result");
  const finalResultText = document.getElementById("final-result");
  const nameError = document.getElementById("name-error");

  const choices = document.querySelectorAll(".choice-button");

  let playerName = "";
  let playerScore = 0;
  let computerScore = 0;
  const maxScore = 5;

  function show(el) {
    el.classList.remove("hidden");
    el.classList.add("active");
  }

  function hide(el) {
    el.classList.remove("active");
    el.classList.add("hidden");
  }

  function toNameScreen() {
    hide(welcomeScreen);
    show(nameScreen);
  }

  startBtn.addEventListener("click", toNameScreen);
  skipIntroBtn.addEventListener("click", toNameScreen);

  submitNameBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name.length < 2) {
      nameError.textContent = "Please enter your name (at least 2 characters).";
      return;
    }
    nameError.textContent = "";
    playerName = name;
    greeting.textContent = `Hello, ${playerName}! First to ${maxScore} wins.`;
    resetScores();
    hide(nameScreen);
    show(gameScreen);
    sidebar.classList.remove("hidden");
  });

  restartBtn.addEventListener("click", () => {
    hide(endScreen);
    show(nameScreen);
    sidebar.classList.remove("hidden");
    playerNameInput.value = "";
    resultText.textContent = "";
  });

  choices.forEach(btn => {
    btn.addEventListener("click", () => {
      playRound(btn.dataset.choice);
    });
  });

  function playRound(playerChoice) {
    if (playerScore >= maxScore || computerScore >= maxScore) return;
    const options = ["rock", "paper", "scissors"];
    const computerChoice = options[Math.floor(Math.random() * options.length)];
    if (playerChoice === computerChoice) {
      resultText.textContent = `It's a tie! You both chose ${playerChoice}.`;
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      playerScore++;
      resultText.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else {
      computerScore++;
      resultText.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
    }
    updateScores();
    if (playerScore >= maxScore || computerScore >= maxScore) endGame();
  }

  function updateScores() {
    playerScoreText.textContent = `${playerName || "Player"}: ${playerScore}`;
    computerScoreText.textContent = `Computer: ${computerScore}`;
  }

  function resetScores() {
    playerScore = 0;
    computerScore = 0;
    updateScores();
  }

  function endGame() {
    hide(gameScreen);
    show(endScreen);
    sidebar.classList.add("hidden");
    finalResultText.textContent =
      playerScore > computerScore ? `${playerName} wins the game!` : "Computer wins the game!";
  }
});