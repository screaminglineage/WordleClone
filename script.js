const WORD = "APPLE";
const board = document.getElementById("game-board");
let currentRow = 0;
let currentGuess = "";

function createTiles() {
  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }
}
createTiles();

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  if (e.key === "Enter") {
    if (currentGuess.length === 5) checkGuess();
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

function checkGuess() {
  const start = currentRow * 5;
  for (let i = 0; i < 5; i++) {
    const tile = board.children[start + i];
    const letter = currentGuess[i];
    if (letter === WORD[i]) tile.classList.add("correct");
    else if (WORD.includes(letter)) tile.classList.add("present");
    else tile.classList.add("absent");
  }
  currentRow++;
  currentGuess = "";
}
