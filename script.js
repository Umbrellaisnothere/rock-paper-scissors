document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const nameScreen = document.getElementById("name-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");

  const startBtn = document.getElementById("start-btn");
  const nameForm = document.getElementById("name-form");
  const restartBtn = document.getElementById("restart-btn");

  const playerNameInput = document.getElementById("player-name");
  const playerNameDisplay = document.getElementById("player-name-display");
  const playerScoreText = document.getElementById("player-score");
  const computerScoreText = document.getElementById("computer-score");
  const playerHandVisual = document.getElementById("player-hand-visual");
  const playerHandLabel = document.getElementById("player-hand-label");
  const computerHandVisual = document.getElementById("computer-hand-visual");
  const computerHandLabel = document.getElementById("computer-hand-label");
  const resultEl = document.getElementById("result");
  const resultHeadline = document.getElementById("result-headline");
  const resultDetail = document.getElementById("result-detail");
  const matchSummary = document.getElementById("match-summary");
  const endStatus = document.getElementById("end-status");
  const endWinner = document.getElementById("end-winner");
  const endScore = document.getElementById("end-score");
  const endMessage = document.getElementById("end-message");
  const nameError = document.getElementById("name-error");

  const choices = document.querySelectorAll(".choice-button");

  const HANDS = {
    rock: { emoji: "✊", name: "Rock" },
    paper: { emoji: "✋", name: "Paper" },
    scissors: { emoji: "✌️", name: "Scissors" },
  };

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

  function setHand(side, choice) {
    const visual = side === "player" ? playerHandVisual : computerHandVisual;
    const label = side === "player" ? playerHandLabel : computerHandLabel;
    if (!choice) {
      visual.textContent = "?";
      label.textContent = "Waiting";
      return;
    }
    visual.textContent = HANDS[choice].emoji;
    label.textContent = HANDS[choice].name;
  }

  function setResult(kind, headline, detail) {
    resultEl.classList.remove("result--idle", "result--win", "result--lose", "result--draw");
    resultEl.classList.add(`result--${kind}`);
    resultHeadline.textContent = headline;
    resultDetail.textContent = detail || "";
  }

  function clearSelectedChoices() {
    choices.forEach((btn) => {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  function markSelectedChoice(playerChoice) {
    clearSelectedChoices();
    choices.forEach((btn) => {
      if (btn.dataset.choice === playerChoice) {
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
      }
    });
  }

  function resetArena() {
    setHand("player", null);
    setHand("computer", null);
    setResult("idle", "Choose your hand", "");
    clearSelectedChoices();
  }

  function startMatch() {
    clearScheduledTimers();
    playerScore = 0;
    computerScore = 0;
    playerNameDisplay.textContent = playerName || "Player";
    updateScores();
    resetArena();
    unlockRound();
    hide(welcomeScreen);
    hide(nameScreen);
    hide(endScreen);
    show(gameScreen);
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
    markSelectedChoice(playerChoice);

    const options = ["rock", "paper", "scissors"];
    const computerChoice = options[Math.floor(Math.random() * options.length)];
    const playerHand = HANDS[playerChoice];
    const computerHand = HANDS[computerChoice];

    setHand("player", playerChoice);
    setHand("computer", computerChoice);

    if (playerChoice === computerChoice) {
      setResult("draw", "Draw", `You both chose ${playerHand.name}`);
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      playerScore++;
      setResult("win", "You win", `${playerHand.name} beats ${computerHand.name}`);
    } else {
      computerScore++;
      setResult("lose", "You lose", `${computerHand.name} beats ${playerHand.name}`);
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
    playerScoreText.textContent = String(playerScore);
    computerScoreText.textContent = String(computerScore);
  }

  function endGame() {
    const playerWon = playerScore > computerScore;
    matchSummary.classList.toggle("match-summary--win", playerWon);
    matchSummary.classList.toggle("match-summary--lose", !playerWon);
    endStatus.textContent = playerWon ? "Victory" : "Defeat";
    endWinner.textContent = playerWon ? playerName : "Computer";
    endScore.textContent = `${playerScore} — ${computerScore}`;
    endMessage.textContent = playerWon
      ? "You defeated the Computer."
      : "Computer won this match.";
    hide(gameScreen);
    show(endScreen);
  }
});
