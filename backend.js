const http = require("http");
const fs = require("fs")
const path = require("path")

const PORT = 3000;
const WORDS_FILE_PATH = "words.txt";
const WORD_LENGTH = 5;

function serveFile(res, fileName) {
    fs.readFile(path.join(__dirname, fileName), "utf-8", (err, data) => {
        if (err) {
            console.error(error);
            return;
        }
        res.end(data);
    });
}

function getRandom(low, high) {
    return Math.random() * (high - low) + low;
}

function getRandomWord(length, words) {
    while (true) {
        const i = Math.floor(getRandom(0, words.length - 1));
        const word = words[i];
        if (word.length == length) {
            return word;
        }
    }
}

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        serveFile(res, "index.html");
    } else if (req.url === "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        serveFile(res, "style.css");
    } else if (req.url === "/script.js") {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        serveFile(res, "script.js");
    } else if (req.url === "/getword") {
        fs.readFile(WORDS_FILE_PATH, "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const words = data.split("\n");
            const word = getRandomWord(WORD_LENGTH, words);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(`{"word": "${word}"}`);
        })
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
    }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

