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

    const choices = ["rock", "paper", "scissors"];
    let playerScore = 0;
    let computerScore = 0;

    while (true) {
        let playerChoice = prompt("Enter your choice (rock, paper, scissors) or type 'exit' to quit: ").toLowerCase();

        if (playerChoice === "exit") {
            alert("Thanks for playing! Goodbye!");
            break;
        }

        if (!choices.includes(playerChoice)) {
            alert("Invalid choice. Please choose rock, paper, or scissors.");
            continue;
        }


        let computerChoice = choices[Math.floor(Math.random() * choices.length)];
        
        alert(`${formattedName} chose ${playerChoice}`);
        alert(`Computer chose ${computerChoice}`);

        if(playerChoice === computerChoice) {
            alert("It is a tie!");
        } else if (
            (playerChoice === "rock" && computerChoice === "scissors") ||
            (playerChoice === "paper" && computerChoice === "rock") ||
            (playerChoice === "scissors" && computerChoice === "paper")
        ) {
            alert("You win this round!");
            playerScore++
        } else {
            alert("You lose!");
            computerScore++;
        }  

        alert(`Current Score - ${formattedName}: ${playerScore} | Computer: ${computerScore}`);
    }

    if(playerScore === 5) {
        alert(`Congratulations ${formattedName}, you won the game!`);
    } else {
        alert("Computer AI won before you reached 5 points. Better luck next time!");
    }
    alert(`Final Score - ${formattedName}: ${playerScore} | Computer: ${computerScore}`);
    alert("Game Over. Thanks for playing!")
    }


startGame();