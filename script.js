const welcomeScreen = document.getElementById("welcome-screen");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const playButton = document.getElementById("play-button");
const playAgainBtn = document.getElementById("play-again-button");
const playerNameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");


const welcomeMessage = document.getElementById("welcome-message");
const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");
const resultMessage = document.getElementById("result-message");
const finalMessage = document.getElementById("final-message");

const choiceButtons = document.querySelectorAll(".choice-button");

let playerScore = 0;
let computerScore = 0;
let playerName = "";
const maxScore = 5;
const choices = ["rock", "paper", "scissors"];

const bannedWords = ["idiot", "stupid", "fool", "dumb", "fuck", "shit", "asshole", "nigga"];

setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    welcomeScreen.classList.remove("active");

    startScreen.classList.add("active");
    startScreen.classList.remove("hidden");
}, 3000);

function isValidName(name) {
    const trimmedName = name.trim().toLowerCase();
    const clean = /^[A-Za-z]{2,}$/.test(trimmedName);

    if (!clean) return false;

    return !bannedWords.some(bad => trimmedName.includes(bad));
}


startButton.addEventListener("click", () => {
    const nameInput = playerNameInput.value.trim();

    if (!isValidName(nameInput)) {
        nameError.textContent = "Please enter a valid name (at least 2 letters).";
        return;
    } else {
        nameError.textContent = "";
    }

    playerName = nameInput.charAt(0).toUpperCase() + nameInput.slice(1).toLowerCase();
    welcomeMessage.textContent = `Hello, ${playerName}! First to ${maxScore} wins!`;
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("active");
});

choiceButtons.forEach(button => {
    button.addEventListener("click" , () => {
        playRound(button.dataset.choice);
    });
});

function playRound(playerChoice) {
    if (playerScore === maxScore || computerScore === maxScore) return;

    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultText = "";
    let outcomeClass = "";

    if(playerChoice === computerChoice) {
        resultText = `It's a tie! You both chose ${playerChoice}.`;
        outcomeClass = "tie";
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||          (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        resultText = `You win this round! ${playerChoice} beats ${computerChoice}.`;
        outcomeClass = "win";
        playerScore++
    } else {
        resultText = `You lose this round! ${computerChoice} beats ${playerChoice}.`;
        outcomeClass = "lose";
        computerScore++;
    }  

    updateScores();
    animateResult(resultText, outcomeClass);

    if (playerScore === maxScore || computerScore === maxScore) {
        endGame();
    }
}

function animateResult(text, type) {
    resultMessage.textContent = text;
    resultMessage.classList.remove("win", "lose", "tie"); // reset

    void resultMessage.offsetWidth; // force a reflow

    resultMessage.classList.add(type);

    setTimeout(() => {
        resultMessage.classList.remove(type);
    }, 1000);
}

function updateScores() {
    playerScoreDisplay.textContent = `Your Score: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
}

function endGame() {
    gameScreen.classList.add("hidden");
    endScreen.classList.add("active");
    endScreen.classList.remove("hidden");

    finalMessage.textContent =
        playerScore === maxScore
        ? `Congratulations, ${playerName}! You won the game!`
        : "Computer AI won before you reached 5 points. Better luck next time!";
}

playAgainBtn.addEventListener("click", () => {
    playerScore = 0;
    computerScore = 0;
    updateScores();

    resultMessage.textContent = "";
    finalMessage.textContent = "";

    endScreen.classList.add("hidden");
    endScreen.classList.remove("active");

    startScreen.classList.remove("hidden");
    startScreen.classList.add("active");
    gameScreen.classList.remove("active");

    playerNameInput.value = "";
    nameError.textContent = "";
    welcomeMessage.textContent = "Welcome to Rock, Paper, Scissors!";
    playerName = "";
});