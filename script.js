let WORD = "";
const URL = "http://localhost:3000";

const board = document.getElementById("game-board");
let currentRow = 0;
let currentGuess = "";

function handleKeyPress(e) {
  if (e.key === "Enter") {
    if (currentGuess.length === 5) checkGuess(WORD);
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
  currentGuess = "";
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

fetch(`${URL}/getword`)
    .then(response => response.json())
    .then(data => {
        WORD = data["word"];
        console.log(WORD);
    })
    .catch(error => {
        console.error(error);
    });


