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
  const playerMatchPoint = document.getElementById("player-match-point");
  const computerMatchPoint = document.getElementById("computer-match-point");
  const playerHandCard = document.getElementById("player-hand-card");
  const computerHandCard = document.getElementById("computer-hand-card");
  const playerHandVisual = document.getElementById("player-hand-visual");
  const playerHandLabel = document.getElementById("player-hand-label");
  const computerHandVisual = document.getElementById("computer-hand-visual");
  const computerHandLabel = document.getElementById("computer-hand-label");
  const resultEl = document.getElementById("result");
  const resultMark = document.getElementById("result-mark");
  const resultHeadline = document.getElementById("result-headline");
  const resultDetail = document.getElementById("result-detail");
  const matchObjective = document.getElementById("match-objective");
  const playerScoreCard = document.querySelector(".score-card--player");
  const computerScoreCard = document.querySelector(".score-card--computer");
  const matchSummary = document.getElementById("match-summary");
  const endStatus = document.getElementById("end-status");
  const endWinner = document.getElementById("end-winner");
  const endScore = document.getElementById("end-score");
  const endMessage = document.getElementById("end-message");
  const finalPlayerVisual = document.getElementById("final-player-visual");
  const finalPlayerLabel = document.getElementById("final-player-label");
  const finalComputerVisual = document.getElementById("final-computer-visual");
  const finalComputerLabel = document.getElementById("final-computer-label");
  const finalRoundDetail = document.getElementById("final-round-detail");
  const nameError = document.getElementById("name-error");
  const statRounds = document.getElementById("stat-rounds");
  const statWins = document.getElementById("stat-wins");
  const statLosses = document.getElementById("stat-losses");
  const statDraws = document.getElementById("stat-draws");
  const statStreak = document.getElementById("stat-streak");
  const statBest = document.getElementById("stat-best");
  const streakNote = document.getElementById("streak-note");
  const streakStat = document.querySelector(".stat--streak");
  const bestStat = document.querySelector(".stat--best");
  const endStatRounds = document.getElementById("end-stat-rounds");
  const endStatWins = document.getElementById("end-stat-wins");
  const endStatLosses = document.getElementById("end-stat-losses");
  const endStatDraws = document.getElementById("end-stat-draws");
  const endStatBest = document.getElementById("end-stat-best");
  const soundToggle = document.getElementById("sound-toggle");
  const soundToggleLabel = document.getElementById("sound-toggle-label");

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
  let roundGeneration = 0;
  let thinkTimeoutId = null;
  let revealTimeoutId = null;
  let endGameTimeoutId = null;
  let lastRound = null;
  const matchStats = {
    rounds: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
  const maxScore = 5;
  const CPU_THINK_MS = 600;
  const REVEAL_TO_RESULT_MS = 220;
  const MATCH_END_DELAY_MS = 1100;

  function createGameAudio() {
    let ctx = null;
    let output = null;
    let muted = false;

    function ensureContext() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) {
        ctx = new AC();
        output = ctx.createGain();
        output.gain.value = 0.16;
        output.connect(ctx.destination);
      }
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    function beep(c, { freq, freqEnd, duration, type = "sine", gain = 0.2, delay = 0 }) {
      const t0 = c.currentTime + delay;
      const osc = c.createOscillator();
      const amp = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), t0 + duration);
      }
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(amp);
      amp.connect(output);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    }

    function play(builder) {
      if (muted) return;
      try {
        const c = ensureContext();
        if (!c) return;
        builder(c);
      } catch (_err) {
        /* Audio must never break gameplay. */
      }
    }

    return {
      unlock() {
        try {
          ensureContext();
        } catch (_err) {
          /* Ignore locked or missing audio. */
        }
      },
      isMuted() {
        return muted;
      },
      setMuted(value) {
        muted = Boolean(value);
      },
      playSelect() {
        play((c) => beep(c, { freq: 880, duration: 0.05, gain: 0.12 }));
      },
      playReveal() {
        play((c) => beep(c, { freq: 480, freqEnd: 720, duration: 0.11, gain: 0.14 }));
      },
      playWin() {
        play((c) => {
          beep(c, { freq: 523, duration: 0.08, gain: 0.14 });
          beep(c, { freq: 659, duration: 0.1, gain: 0.14, delay: 0.07 });
        });
      },
      playLoss() {
        play((c) => beep(c, { freq: 280, freqEnd: 160, duration: 0.16, type: "triangle", gain: 0.12 }));
      },
      playDraw() {
        play((c) => beep(c, { freq: 392, duration: 0.1, type: "triangle", gain: 0.12 }));
      },
      playMatchPoint() {
        play((c) => {
          beep(c, { freq: 698, duration: 0.09, gain: 0.11, delay: 0.16 });
          beep(c, { freq: 880, duration: 0.12, gain: 0.11, delay: 0.24 });
        });
      },
      playVictory() {
        play((c) => {
          beep(c, { freq: 523, duration: 0.1, gain: 0.15 });
          beep(c, { freq: 659, duration: 0.1, gain: 0.15, delay: 0.09 });
          beep(c, { freq: 784, duration: 0.18, gain: 0.16, delay: 0.18 });
        });
      },
      playDefeat() {
        play((c) => {
          beep(c, { freq: 330, duration: 0.12, type: "triangle", gain: 0.12 });
          beep(c, { freq: 220, duration: 0.2, type: "triangle", gain: 0.12, delay: 0.11 });
        });
      },
    };
  }

  const audio = createGameAudio();

  function renderSoundToggle() {
    const muted = audio.isMuted();
    soundToggle.setAttribute("aria-pressed", muted ? "true" : "false");
    soundToggleLabel.textContent = muted ? "Sound off" : "Sound on";
  }

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
    roundGeneration += 1;
    if (thinkTimeoutId !== null) {
      clearTimeout(thinkTimeoutId);
      thinkTimeoutId = null;
    }
    if (revealTimeoutId !== null) {
      clearTimeout(revealTimeoutId);
      revealTimeoutId = null;
    }
    if (endGameTimeoutId !== null) {
      clearTimeout(endGameTimeoutId);
      endGameTimeoutId = null;
    }
  }

  function restartAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function setHand(side, choice, { animate = false } = {}) {
    const card = side === "player" ? playerHandCard : computerHandCard;
    const visual = side === "player" ? playerHandVisual : computerHandVisual;
    const label = side === "player" ? playerHandLabel : computerHandLabel;
    card.classList.remove("is-thinking");
    if (!choice) {
      visual.textContent = "?";
      label.textContent = side === "player" ? "Your move" : "Waiting";
      visual.classList.remove("is-revealing");
      card.classList.add("is-waiting");
      return;
    }
    card.classList.remove("is-waiting");
    visual.textContent = HANDS[choice].emoji;
    label.textContent = HANDS[choice].name;
    if (animate) {
      restartAnimation(visual, "is-revealing");
    } else {
      visual.classList.remove("is-revealing");
    }
  }

  function setComputerThinking() {
    computerHandCard.classList.remove("is-waiting");
    computerHandCard.classList.add("is-thinking");
    computerHandVisual.classList.remove("is-revealing");
    computerHandVisual.textContent = "?";
    computerHandLabel.textContent = "Thinking...";
  }

  function setResult(kind, headline, detail) {
    resultEl.classList.remove(
      "result--idle",
      "result--pending",
      "result--win",
      "result--lose",
      "result--draw",
      "is-entering"
    );
    resultEl.classList.add(`result--${kind}`);
    resultHeadline.textContent = headline;
    resultDetail.textContent = detail || "";
    if (kind === "win") resultMark.textContent = "✓";
    else if (kind === "lose") resultMark.textContent = "✕";
    else if (kind === "draw") resultMark.textContent = "=";
    else resultMark.textContent = "";
    if (kind === "win" || kind === "lose" || kind === "draw") {
      restartAnimation(resultEl, "is-entering");
    }
  }

  function pulseScore(el) {
    restartAnimation(el, "is-pulsed");
  }

  function resetMatchStats() {
    matchStats.rounds = 0;
    matchStats.wins = 0;
    matchStats.losses = 0;
    matchStats.draws = 0;
    matchStats.currentStreak = 0;
    matchStats.bestStreak = 0;
  }

  function recordResolvedRound(kind) {
    matchStats.rounds += 1;
    let newBest = false;
    if (kind === "win") {
      matchStats.wins += 1;
      matchStats.currentStreak += 1;
      if (matchStats.currentStreak > matchStats.bestStreak) {
        matchStats.bestStreak = matchStats.currentStreak;
        newBest = matchStats.bestStreak >= 2;
      }
    } else if (kind === "lose") {
      matchStats.losses += 1;
      matchStats.currentStreak = 0;
    } else if (kind === "draw") {
      matchStats.draws += 1;
    }
    renderMatchStats(newBest);
  }

  function renderMatchStats(newBest = false) {
    statRounds.textContent = String(matchStats.rounds);
    statWins.textContent = String(matchStats.wins);
    statLosses.textContent = String(matchStats.losses);
    statDraws.textContent = String(matchStats.draws);
    statStreak.textContent = String(matchStats.currentStreak);
    statBest.textContent = String(matchStats.bestStreak);

    const hotStreak = matchStats.currentStreak >= 2;
    streakStat.classList.toggle("is-hot", hotStreak);
    streakNote.textContent = hotStreak ? `${matchStats.currentStreak} win streak` : "";
    streakNote.classList.toggle("is-visible", hotStreak);

    bestStat.classList.remove("is-record");
    if (newBest) {
      restartAnimation(bestStat, "is-record");
    }
  }

  function renderEndStats() {
    endStatRounds.textContent = String(matchStats.rounds);
    endStatWins.textContent = String(matchStats.wins);
    endStatLosses.textContent = String(matchStats.losses);
    endStatDraws.textContent = String(matchStats.draws);
    endStatBest.textContent = String(matchStats.bestStreak);
  }

  function updateMatchPoint() {
    const playerAtPoint = playerScore === maxScore - 1;
    const computerAtPoint = computerScore === maxScore - 1;
    playerMatchPoint.classList.toggle("is-active", playerAtPoint);
    computerMatchPoint.classList.toggle("is-active", computerAtPoint);
    playerScoreCard.classList.toggle("is-match-point", playerAtPoint);
    computerScoreCard.classList.toggle("is-match-point", computerAtPoint);
    matchObjective.classList.toggle("is-match-point", playerAtPoint || computerAtPoint);
    if (playerAtPoint && computerAtPoint) {
      matchObjective.textContent = "Both at match point";
    } else if (playerAtPoint || computerAtPoint) {
      matchObjective.textContent = "Match point";
    } else {
      matchObjective.textContent = "First to 5";
    }
  }

  function clearSelectedChoices() {
    choices.forEach((btn) => {
      btn.classList.remove("is-selected", "is-resolved");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  function markSelectedChoice(playerChoice) {
    clearSelectedChoices();
    choices.forEach((btn) => {
      const selected = btn.dataset.choice === playerChoice;
      btn.classList.toggle("is-selected", selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
      if (!selected && document.activeElement === btn) {
        btn.blur();
      }
    });
  }

  function resetArena() {
    lastRound = null;
    setHand("player", null);
    setHand("computer", null);
    setResult("idle", "Make your move", "Choose Rock, Paper, or Scissors");
    playerScoreText.classList.remove("is-pulsed");
    computerScoreText.classList.remove("is-pulsed");
    updateMatchPoint();
    clearSelectedChoices();
  }

  function startMatch() {
    clearScheduledTimers();
    playerScore = 0;
    computerScore = 0;
    resetMatchStats();
    renderMatchStats();
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
    audio.unlock();
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
    audio.unlock();
    startMatch();
  });

  restartBtn.addEventListener("click", () => {
    audio.unlock();
    startMatch();
  });

  soundToggle.addEventListener("click", () => {
    audio.unlock();
    audio.setMuted(!audio.isMuted());
    renderSoundToggle();
  });

  renderSoundToggle();

  choices.forEach((btn) => {
    btn.addEventListener("click", () => {
      playRound(btn.dataset.choice);
    });
  });

  function resolveRound(playerChoice, computerChoice) {
    const playerHand = HANDS[playerChoice];
    const computerHand = HANDS[computerChoice];
    let kind;
    let headline;
    let detail;
    let scorer = null;

    if (playerChoice === computerChoice) {
      kind = "draw";
      headline = "Draw";
      detail = `Both players chose ${playerHand.name}`;
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      playerScore++;
      scorer = "player";
      kind = "win";
      headline = "You win";
      detail = `${playerHand.name} beats ${computerHand.name}`;
    } else {
      computerScore++;
      scorer = "computer";
      kind = "lose";
      headline = "You lose";
      detail = `${computerHand.name} beats ${playerHand.name}`;
    }

    lastRound = {
      playerChoice,
      computerChoice,
      kind,
      detail,
    };

    recordResolvedRound(kind);
    setResult(kind, headline, detail);
    choices.forEach((btn) => {
      if (btn.classList.contains("is-selected")) {
        btn.classList.add("is-resolved");
      }
    });
    updateScores();
    if (scorer === "player") pulseScore(playerScoreText);
    if (scorer === "computer") pulseScore(computerScoreText);
    updateMatchPoint();

    if (kind === "win") audio.playWin();
    else if (kind === "lose") audio.playLoss();
    else audio.playDraw();

    if (kind === "win" && playerScore === maxScore - 1) {
      audio.playMatchPoint();
    }
  }

  function playRound(playerChoice) {
    if (isRoundLocked) return;
    if (playerScore >= maxScore || computerScore >= maxScore) return;

    lockRound();
    audio.unlock();
    audio.playSelect();
    markSelectedChoice(playerChoice);
    setHand("player", playerChoice, { animate: true });
    setComputerThinking();
    setResult("pending", "Your move is in", "Computer is choosing");

    const options = ["rock", "paper", "scissors"];
    const computerChoice = options[Math.floor(Math.random() * options.length)];
    const generation = roundGeneration;

    thinkTimeoutId = setTimeout(() => {
      if (generation !== roundGeneration) return;
      thinkTimeoutId = null;
      setHand("computer", computerChoice, { animate: true });
      audio.playReveal();

      revealTimeoutId = setTimeout(() => {
        if (generation !== roundGeneration) return;
        revealTimeoutId = null;
        resolveRound(playerChoice, computerChoice);

        if (playerScore >= maxScore || computerScore >= maxScore) {
          endGameTimeoutId = setTimeout(() => {
            if (generation !== roundGeneration) return;
            endGameTimeoutId = null;
            endGame();
          }, MATCH_END_DELAY_MS);
          return;
        }

        unlockRound();
      }, REVEAL_TO_RESULT_MS);
    }, CPU_THINK_MS);
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

    if (lastRound) {
      const playerHand = HANDS[lastRound.playerChoice];
      const computerHand = HANDS[lastRound.computerChoice];
      finalPlayerVisual.textContent = playerHand.emoji;
      finalPlayerLabel.textContent = playerHand.name;
      finalComputerVisual.textContent = computerHand.emoji;
      finalComputerLabel.textContent = computerHand.name;
      finalRoundDetail.textContent = lastRound.detail;
    }

    renderEndStats();
    if (playerWon) audio.playVictory();
    else audio.playDefeat();
    hide(gameScreen);
    show(endScreen);
  }
});
