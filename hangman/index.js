const body = document.querySelector(".body");

const questionsList = [
    {
        word: "Spain",
        question: "Famous for bullfights and flamenco."
    },
    {
        word: "villa",
        question: "A big house in the country with a large garden."
    },
    {
        word: "snack",
        question: "A small amount of food that is eaten between meals, or a very small meal."
    },
    {
        word: "panda",
        question: "A large black and white mammal similar to a bear, that lives in forests in China."
    },
    {
        word: "school",
        question: "A place where children go to be educated."
    },
    {
        word: "London",
        question: "The capital of Great Britain."
    },
    {
        word: "team",
        question: "A group of people who compete in a sport, game, etc., against another group."
    },
    {
        word: "cargo",
        question: "The goods that are being carried in a ship or plane."
    },
    {
        word: "witch",
        question: "An ugly woman practicing magic."
    },
    {
        word: "vampire",
        question: "His favourite drink is blood."
    },
    {
        word: "pill",
        question: "A small solid piece of medicine that you swallow with water."
    },
    {
        word: "baker",
        question: "A person whose trade is making and selling bread and cakes."
    },
    {
        word: "winter",
        question: "The season when we celebrate Christmas."
    }
];

let hangman = document.createElement("header");
hangman.classList.add("header");
body.appendChild(hangman);

let main = document.createElement("main");
main.classList.add("main");
body.appendChild(main);

let headerTitle = document.createElement("h1");
headerTitle.classList.add("header__title");
headerTitle.innerText = `HANGMAN GAME`;
hangman.appendChild(headerTitle);

let word = document.createElement("ul");
word.classList.add("hangman-words");
main.appendChild(word);

let hangmanContent = document.createElement("div");
hangmanContent.classList.add("hangman-content");
main.appendChild(hangmanContent);

let hangmanContentText = document.createElement("div");
hangmanContentText.classList.add("hangman-text");
hangmanContent.appendChild(hangmanContentText);

let hint = document.createElement("p");
hint.classList.add("hangman-text__hint");
hint.innerText = `Hint: `;
hangmanContentText.appendChild(hint);

let hintText = document.createElement("span");
hintText.classList.add("hangman__hint-description");
hint.appendChild(hintText);

let attempts = document.createElement("p");
attempts.classList.add("hangman-text__attempts");
attempts.innerText = `Incorrect guesses: `;
hangmanContentText.appendChild(attempts);

let attemptsText = document.createElement("span");
attemptsText.classList.add("hangman__attempts-description");
attempts.appendChild(attemptsText);

let hangmanImg = document.createElement("img");
hangmanImg.classList.add("hangman-img");
hangmanImg.alt="Hangman";
hangmanContent.appendChild(hangmanImg);

let keyboard = document.createElement("div");
keyboard.classList.add("hangman-keyboard");
main.appendChild(keyboard);

let modal = document.createElement("div");
modal.classList.add("modal");
body.appendChild(modal);

let modalMain = document.createElement("div");
modalMain.classList.add("modal__main");
modal.appendChild(modalMain);

let modalTitle = document.createElement("p");
modalTitle.classList.add("modal__title");
modalMain.appendChild(modalTitle);

let modalText = document.createElement("p");
modalText.classList.add("modal__text");
modalMain.appendChild(modalText);

let modalButton = document.createElement("button");
modalButton.classList.add("modal__button");
modalButton.innerText = `Play Again`;
modalMain.appendChild(modalButton);


for (let i = 65; i <= 90; i++) {
    const letter = document.createElement("button");
    letter.classList.add("hangman-keyboard__letter");
    const letterName = String.fromCharCode(i);
    letter.innerText = letterName;
    keyboard.appendChild(letter);
    letter.addEventListener("click", event => startGame(event.target, letterName));
}

let keyboardLetter = keyboard.querySelectorAll(".hangman-keyboard__letter");

document.addEventListener("keydown", event => {
    const selectedKey = event.key.toUpperCase();
    if (/^[а-яё]$/i.test(selectedKey)) {
        event.preventDefault();
        console.log("Change your keyboard layout!");
    } else {
        for (const letter of keyboardLetter) {
            if (letter.innerText === selectedKey && !letter.disabled) {
                startGame(letter, selectedKey);
            }
        }
    }
});

let secretWord = "";
let pairs = [];
function randomSecretWord() {
    if (pairs.length === questionsList.length) {
        pairs = [];   
    }
    let randomNumber;
    let randomPair;
    do {
       randomNumber = Math.floor(Math.random() * questionsList.length); 
       randomPair = questionsList[randomNumber];
    } while (pairs.includes(randomPair));
    pairs.push(randomPair);
    secretWord = randomPair.word;
    hintText.innerText = randomPair.question;
    console.log(secretWord);
    reloadGame();
}
let incorrectCounter = 0;
let lettersSecretWord = [];
let gameStoped = false;
function reloadGame() {
    lettersSecretWord = [];
    incorrectCounter = 0;
    attemptsText.innerText = `0 / 6`;
    gameStoped = false;
    for (let i = 0; i < keyboardLetter.length; i++) {
        keyboardLetter[i].disabled = false;
    }
    hangmanImg.src = `images/step-${incorrectCounter}.svg`;
    modal.classList.remove("active");
    body.classList.remove('lock');
    word.innerHTML = `<li class="hangman-words__letter"></li>`.repeat(secretWord.length);
}

function startGame(button, selectedLetter) {
    let selectedIndex = secretWord.toUpperCase().indexOf(selectedLetter);
    if (gameStoped) {
        return;
    };
    if (selectedIndex !== -1) {
        while (selectedIndex !== -1) {
        lettersSecretWord.push(selectedLetter);
        let wordLetter = word.querySelectorAll(".hangman-words__letter")[selectedIndex];
        wordLetter.innerText = selectedLetter;
        wordLetter.classList.add("correct");
        selectedIndex = secretWord.toUpperCase().indexOf(selectedLetter, selectedIndex + 1);
        }
    } else {
        incorrectCounter++;
        hangmanImg.src = `images/step-${incorrectCounter}.svg`;
    }
    button.disabled = true;
    attemptsText.innerText = `${incorrectCounter} / 6`;
    checkGameOver();
}

function checkGameOver() {
    if(incorrectCounter === 6) {
        gameOver(false);
    } else if(lettersSecretWord.length === secretWord.length) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    gameStoped = true;
    if (isWin) {
        modalTitle.innerText = `YOU WIN!`;
    } else {
        modalTitle.innerText = `GAME OVER!`;
    }
    modalText.innerHTML = `THE WORD: <span class="modal__text-word">${secretWord.toUpperCase()}</span>`;
    modal.classList.add("active");
    body.classList.add('lock');
    modalButton.addEventListener("click", randomSecretWord);
}

randomSecretWord();