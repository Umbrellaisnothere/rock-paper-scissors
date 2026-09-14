document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const nameScreen = document.getElementById("name-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const sidebar = document.getElementById("sidebar");

  const startBtn = document.getElementById("start-btn");
  const nameForm = document.getElementById("name-form");
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
  let isRoundLocked = false;
  let endGameTimeoutId = null;
  const maxScore = 5;
  const MATCH_END_DELAY_MS = 1100;

  function show(el) {
    el.classList.remove("hidden");
    el.classList.add("active");
  }

  function hide(el) {
    el.classList.remove("active");
    el.classList.add("hidden");
  }

  function setChoicesEnabled(enabled) {
    choices.forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function lockRound() {
    isRoundLocked = true;
    setChoicesEnabled(false);
  }

  function unlockRound() {
    isRoundLocked = false;
    setChoicesEnabled(true);
  }

  function clearScheduledTimers() {
    if (endGameTimeoutId !== null) {
      clearTimeout(endGameTimeoutId);
      endGameTimeoutId = null;
    }
  }

  function startMatch() {
    clearScheduledTimers();
    playerScore = 0;
    computerScore = 0;
    resultText.textContent = "";
    updateScores();
    unlockRound();
    hide(welcomeScreen);
    hide(nameScreen);
    hide(endScreen);
    show(gameScreen);
    sidebar.classList.remove("hidden");
  }

  function showNameError(message) {
    nameError.textContent = message;
    playerNameInput.setAttribute("aria-invalid", "true");
  }

  function clearNameError() {
    nameError.textContent = "";
    playerNameInput.setAttribute("aria-invalid", "false");
  }

  startBtn.addEventListener("click", () => {
    hide(welcomeScreen);
    show(nameScreen);
    playerNameInput.focus();
  });

  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = playerNameInput.value.trim();
    if (name.length < 2) {
      showNameError("Please enter your name (at least 2 characters).");
      playerNameInput.focus();
      return;
    }
    clearNameError();
    playerName = name;
    greeting.textContent = `Hello, ${playerName}! First to ${maxScore} wins.`;
    startMatch();
  });

  restartBtn.addEventListener("click", () => {
    startMatch();
  });

  choices.forEach((btn) => {
    btn.addEventListener("click", () => {
      playRound(btn.dataset.choice);
    });
  });

  function playRound(playerChoice) {
    if (isRoundLocked) return;
    if (playerScore >= maxScore || computerScore >= maxScore) return;

    lockRound();

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

    if (playerScore >= maxScore || computerScore >= maxScore) {
      endGameTimeoutId = setTimeout(() => {
        endGameTimeoutId = null;
        endGame();
      }, MATCH_END_DELAY_MS);
      return;
    }

    // Defer unlock so extra clicks already queued in this turn cannot start another round.
    setTimeout(() => {
      unlockRound();
    }, 0);
  }

  function updateScores() {
    playerScoreText.textContent = `${playerName || "Player"}: ${playerScore}`;
    computerScoreText.textContent = `Computer: ${computerScore}`;
  }

  function endGame() {
    hide(gameScreen);
    show(endScreen);
    sidebar.classList.add("hidden");
    finalResultText.textContent =
      playerScore > computerScore ? `${playerName} wins the game!` : "Computer wins the game!";
  }
});
