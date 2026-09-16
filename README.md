# Rock Paper Scissors

A browser-based Rock, Paper, Scissors game built with vanilla HTML, CSS, and JavaScript. It is a complete first-to-5 match against the computer, with round timing, match-point feedback, session statistics, and optional sound — not a single instant round.

## Features

- Welcome screen and player name entry
- First-to-5 match against the computer
- Player vs Computer arena with Rock, Paper, and Scissors
- CPU thinking and reveal sequence before each result
- Round result feedback, including draws (draws award no points)
- Match-point indication when a side is one point from winning
- Final victory or defeat screen with a recap of the last round
- Play Again starts a new match and keeps the player name
- Match statistics for the current match: rounds, wins, losses, draws, current win streak, and best win streak
- Sound feedback with a mute/unmute control
- Compact Rules panel
- Responsive layout for desktop and mobile
- Keyboard-accessible controls and reduced-motion support

Match statistics live only in memory for the current page session and match. They are not saved to `localStorage`, `sessionStorage`, a database, or an account. Refreshing the page starts a new session.

## How to play

1. Open the game and choose **Start Game**.
2. Enter your name (at least two characters) and continue.
3. Choose Rock, Paper, or Scissors.
4. The computer briefly thinks, then reveals its hand.
5. The round result and score update. A draw does not award a point.
6. Keep playing until one side reaches 5 points.
7. Use **Play Again** to start another match with the same name. Statistics reset for the new match.

## Controls

- **Rock / Paper / Scissors** — play a round
- **Sound on / Sound off** — mute or unmute game cues (the preference lasts for this page session)
- **Rules** — show or hide the win conditions and first-to-5 objective
- **Play Again** — rematch without re-entering your name

There are no keyboard shortcuts for choosing Rock, Paper, or Scissors. The name form, buttons, Sound control, and Rules panel can be used from the keyboard.

## Accessibility

The name step uses a semantic form and label. Controls can be reached from the keyboard and show a visible focus state. Choice and sound buttons expose pressed/muted state. Round results are announced in a live region, and win, loss, and draw feedback is not color-only. Animations respect `prefers-reduced-motion`. This is not a WCAG certification claim.

## Technology

- HTML
- CSS
- JavaScript
- Web Audio API for short sound cues (gameplay does not depend on audio)

No frameworks, build tools, packages, or backend are used.

## Running locally

1. Clone the repository or download the source:

```bash
git clone https://github.com/Umbrellaisnothere/rock-paper-scissors.git

cd rock-paper-scissors
```

2. Open `index.html` in a web browser (double-click the file, or use your editor's Live Server).

## Project structure

- `index.html` — markup and screens
- `style.css` — layout, theme, and motion
- `script.js` — match flow, statistics, and sound
- `README.md` — this file

## License

This project is for educational and personal use.
