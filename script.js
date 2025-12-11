const words = [
"APPLE","HOUSE","TRAIN","PHONE","SHEET","BOARD","LIGHT","GREEN","MUSIC","WATER",
"SOUND","WORDS","SMILE","GRASS","STONE","BRICK","CHAIR","TABLE","SHIRT","CLOUD",
"STORM","EARTH","WORLD","BREAD","SWEET","SHAPE","THING","ROUND","SMOKE","FRUIT",
"LEMON","GRAPE","PEACH","MANGO","HONEY","SUGAR","SALTY","SPICE","BLACK","WHITE",
"BROWN","PINKS","HEART","BRAIN","FAITH","TRUST","DREAM","NIGHT","SLEEP","STARS",
"FLASH","BLINK","MONEY","POWER","WOMAN","MANLY","PEARL","METAL","STEEL","PLANT",
"LEAFY","RIVER","OCEAN","SHORE","WAVES","TIGER","HORSE","SHEEP","GOOSE","CARRY",
"WRITE","READS","THINK","BUILD","MAKER","HANDS","CLOCK","WHEEL","MOTOR","SMALL",
"GIANT","QUICK","SLOWY","SHINY","DIRTY","CLEAN","HAPPY","SADLY","ANGRY","PRIDE",
"LUCKY","MAGIC","QUIET","NOISE","LEVEL","POINT","MARKS","HELLO","WORLD","ROBOT",
"LEARN","TEACH","SOLVE","LOGIC","BASIC","FINAL","BREAK","UNITY","SOLID"
];

// 6 tentativa
const maxAttempts = 6;
let attempts = 0;

// zgjedh fjalën sekrete
let secretWord = getRandomWord();

// statistika
let wins = Number(localStorage.getItem("wins")) || 0;
let losses = Number(localStorage.getItem("losses")) || 0;

updateStats();
generateKeyboard();

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function generateKeyboard() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let keyboardDiv = document.getElementById("keyboard");
    keyboardDiv.innerHTML = "";

    for (let char of alphabet) {
        let key = document.createElement("div");
        key.classList.add("key");
        key.textContent = char;

        key.onclick = () => {
            document.getElementById("guessInput").value += char;
        };

        keyboardDiv.appendChild(key);
    }
}

function colorKeyboard(letter, colorClass) {
    const keys = document.querySelectorAll(".key");
    keys.forEach(k => {
        if (k.textContent === letter && !k.classList.contains("green")) {
            k.classList.add("disabled");

            if (colorClass === "green") k.style.background = "#6cc47f";
            else if (colorClass === "gray") k.style.background = "#b1b1b1";
            else k.style.background = "#e06b6b";
        }
    });
}

function checkWord() {
    let guess = document.getElementById("guessInput").value.toUpperCase();

    if (guess.length !== 5) {
        let input = document.getElementById("guessInput");
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 400);
        return;
    }

    attempts++;

    let resultsDiv = document.getElementById("results");
    let row = document.createElement("div");

    for (let i = 0; i < 5; i++) {
        let box = document.createElement("div");

        box.classList.add("letter-box", "flip", "pop");
        box.style.animationDelay = (i * 0.25) + "s";

        box.textContent = guess[i];

        if (guess[i] === secretWord[i]) {
            box.classList.add("green");
            colorKeyboard(guess[i], "green");
        } else if (secretWord.includes(guess[i])) {
            box.classList.add("gray");
            colorKeyboard(guess[i], "gray");
        } else {
            box.classList.add("red");
            colorKeyboard(guess[i], "red");
        }

        row.appendChild(box);
    }

    resultsDiv.appendChild(row);
    document.getElementById("guessInput").value = "";

    if (guess === secretWord) {
        wins++;
        localStorage.setItem("wins", wins);
        showMessage("Urime! E gjete fjalën!", true);
        resetGame();
    } else if (attempts >= maxAttempts) {
        losses++;
        localStorage.setItem("losses", losses);
        showMessage("Humbje! Fjala ishte: " + secretWord, false);
        resetGame();
    }
}

function showMessage(text, isWin) {
    let msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = isWin ? "win" : "lose";
    msg.style.display = "block";
}

function resetGame() {
    setTimeout(() => {
        attempts = 0;
        document.getElementById("results").innerHTML = "";
        document.getElementById("message").style.display = "none";
        generateKeyboard();
        secretWord = getRandomWord();
        updateStats();
    }, 2500);
}

function updateStats() {
    document.getElementById("stats").innerHTML =
        `Fitore: ${wins} | Humbje: ${losses}`;
}
