let WORD = "";
const URL = "http://localhost:3000";

const board = document.getElementById("game-board");
let currentRow = 0;
let currentGuess = "";
let gameOver = false;

function handleKeyPress(e) {
  if (gameOver) {
      return;
  }
  if (e.key === "Enter") {
    if (currentGuess.length === 5) checkGuess(WORD);
    if (currentGuess === WORD.toUpperCase()) gameOver = true;
    currentGuess = "";
  } else if (e.key === "Backspace") {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateTile();
    }
  } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
    currentGuess += e.key.toUpperCase();
    updateTile();
  }
}

function updateTile() {
  const start = currentRow * 5;
  for (let i = 0; i < 5; i++) {
    const tile = board.children[start + i];
    tile.textContent = currentGuess[i] || "";
  }
}

// function makeGuess() {
//   if (gameOver) return;
//   const guess = document.getElementById("guessInput").value.toLowerCase();
//   if (guess.length !== wordLength) return alert("Word must be " + wordLength + " letters.");
//   attempts.push(guess);
//   document.getElementById("guessInput").value = "";
//   renderBoard();
//
//   if (guess === secretWord) {
//     gameOver = true;
//     setTimeout(() => alert("Congratulations! You guessed the word!"), 100);
//   }
// }

function checkGuess(word) {
  word = word.toUpperCase();
  const start = currentRow * 5;
  for (let i = 0; i < 5; i++) {
    const tile = board.children[start + i];
    const letter = currentGuess[i];
    if (letter === word[i]) tile.classList.add("correct");
    else if (word.includes(letter)) tile.classList.add("present");
    else tile.classList.add("absent");
  }
  currentRow++;
}

function createTiles() {
  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }
}

createTiles();
document.addEventListener("keydown", handleKeyPress);

WORD = localStorage.getItem('wordleWord')
fetch(`${URL}/getword`)
    .then(response => response.json())
    .then(data => {
        WORD = data["word"];
        console.log(WORD);
    })
    .catch(error => {
        console.error(error);
    });


