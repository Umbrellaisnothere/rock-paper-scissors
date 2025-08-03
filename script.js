function startGame() {
    alert("Welcome to the Rock, Paper, Scissors game!");

const name = prompt("Please enter your name: ");
if (!name) {
    alert("Name cannot be empty. Please refresh the page and try again.");
    return;
}

const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

alert(`Hello, ${formattedName}! Let's play!`);
alert("You can choose between rock, paper, or scissors.");
alert("Type 'exit' to quit the game at any time.");
alert("Good luck!");

let playerChoice = prompt("Enter your choice:").toLowerCase();

if (playerChoice === "exit") {
    alert("Thanks for playing! Goodbye!");
} else {
    let choices = ["rock", "paper", "scissors"];
    let computerChoice = choices[Math.floor(Math.random() * choices.length)];

    alert(`Computer chose ${computerChoice}`);

    if(playerChoice === computerChoice) {
        alert("It is a tie!");
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        alert("You win!")
    } else if (
        playerChoice === "rock" ||
        playerChoice === "paper" ||
        playerChoice === "scissors"
    ) {
        alert("You lose!");
    } else {
        alert("Invalid choice. Please choose rock, paper, or scissors.");
    }
    alert("Game Over! Thanks for playing!");
}
}

startGame();