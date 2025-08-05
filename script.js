const startBtn = document.getElementById("start-button");
const gameScreen = document.getElementById("game-screen");
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const welcomeMessage = document.getElementById("welcome-message");
const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");
const resultMsg = document.getElementById("result-message");
const finalMsg = document.getElementById("final-message");
const playAgainBtn = document.getElementById("play-again-button");

let playerScore = 0;
let computerScore = 0;
let playerName = "";
const maxScore = 5;
const choices = ["rock", "paper", "scissors"];


startBtn.addEventListener("click", () => {
    const input = document.getElementById("player-name").value.trim();
    if (input === "") 
        return;
    playerName = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    welcomeMessage.textContent = `Hello, ${playerName}! First to ${maxScore} wins!`;
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("active");
});

document.querySelectorAll(".choice-button").forEach(button => {
    button.addEventListener("click" , () => {
        playRound(button.dataset.choice);
    });
});

function playRound(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    if(playerChoice === computerChoice) {
        resultMsg.textContent = "It's a tie! You both chose " + playerChoice + ".";
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||          (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        resultMsg.textContent = "You win this round! " + playerChoice + " beats " + computerChoice + ".";
        playerScore++
    } else {
        resultMsg.textContent = "You lose this round! " + computerChoice + " beats " + playerChoice + ".";
        computerScore++;
    }  

    updateScores();

    if (playerScore === maxScore || computerScore === maxScore) {
        endGame();
    }
}

function updateScores() {
    playerScoreDisplay.textContent = `Your Score: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
}

function endGame() {
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    finalMsg.textContent =
        playerScore === maxScore
        ? `Congratulations, ${playerName}! You won the game!`
        : "Computer AI won before you reached 5 points. Better luck next time!";
}

playAgainBtn.addEventListener("click", () => {
    playerScore = 0;
    computerScore = 0;
    updateScores();
    resultMsg.textContent = "";
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    startScreen.classList.add("active");
    gameScreen.classList.remove("active");
    document.getElementById("player-name").value = "";
    welcomeMessage.textContent = "Welcome to Rock, Paper, Scissors!";
    playerName = "";
});

// startGame();