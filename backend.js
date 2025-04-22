const http = require("http");
const fs = require("fs")
const path = require("path")

const PORT = 3000;
const WORDS_FILE_PATH = "words.txt";
const WORD_LENGTH = 5;

function serveFile(res, fileName) {
    fs.readFile(path.join(__dirname, fileName), "utf-8", (err, data) => {
        if (err) {
            console.error(err);
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

let submittedWords = [];
let isReady = false;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        serveFile(res, "index.html");
    } else if (req.url === "/results") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        serveFile(res, "results.html");
    } else if (req.url === "/singleplayer") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        serveFile(res, "singleplayer.html");
    } else if (req.url === "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        serveFile(res, "style.css");

    } else if (req.url === "/script.js") {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        serveFile(res, "script.js");

    } else if (req.method === "POST" && req.url === "/submitword") {
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const jsonData = JSON.parse(body);
                const clientId = jsonData.id;
                const word = jsonData.word;
                console.log('Received word:', word);
                submittedWords.push({"word": word, "id": clientId});

                if (submittedWords.length === 2) {
                    console.log('Both words received:', submittedWords);
                    isReady = true;
                }

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Word received');
            } catch (e) {
                console.log(e);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });

    } else if (req.method === 'GET' && req.url.startsWith('/ready')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const clientId = url.searchParams.get('id');
        let otherWord = null;
        if (isReady && clientId) {
            console.log(submittedWords, clientId);
            const other = submittedWords.find(entry => entry.id !== clientId);
            console.log(other);
            otherWord = other?.word || null;
        }

        // console.log("Sending ", otherWord);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ready: isReady,
            words: otherWord
        }));
        // console.log("Ready");

    } else if (req.url === "/getword") {
        // const url = new URL(req.url, `http://${req.headers.host}`);
        // const clientId = url.searchParams.get('id');
        // let otherWord = null;
        // if (isReady && clientId) {
        //     console.log(submittedWords, clientId);
        //     const other = submittedWords.find(entry => entry.id !== clientId);
        //     console.log(other);
        //     otherWord = other?.word || null;
        // }
        //

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

