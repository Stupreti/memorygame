const emojis =  ['💨', '🤪', '😜', '🤡', '🥳', '🤯', '🙃', '😹', '🤣', '😆', '😛', '😎', '🤑', '🤓', '😈', '👻', 
                 '🤠', '🦄', '🍕', '🎉', '🌈', '💀', '🔥', '🍿', '🎁', '👑', '🎧', '🎤', '🐵', '🦋', '🍉', '💎']; // More emojis added
let cards = [...emojis, ...emojis]; // Duplicate for pairs
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timeLeft = 45;
let timerInterval;
let gamePaused = false;

const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const winSound = document.getElementById("winSound");
const stopPlayBtn = document.getElementById("stopPlayBtn");


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function setDifficulty() {
  const difficulty = document.getElementById("difficulty").value;

  if (difficulty === "easy") {
    timeLeft = 60;
    cards = [...emojis.slice(0, 8), ...emojis.slice(0, 8)]; // 16 cards (8 pairs)
    document.querySelector('.memory-game').style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columns
  } else if (difficulty === "medium") {
    timeLeft = 45;
    cards = [...emojis.slice(0, 10), ...emojis.slice(0, 10)]; // 20 cards (10 pairs)
    document.querySelector('.memory-game').style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columns
  } else {
    timeLeft = 30;
    cards = [...emojis.slice(0, 12), ...emojis.slice(0, 12)]; // 24 cards (12 pairs)
    document.querySelector('.memory-game').style.gridTemplateColumns = 'repeat(5, 1fr)'; // 5 columns
  }

  document.getElementById("time").textContent = timeLeft;
}

function startGame() {
  setDifficulty();
  document.getElementById("winMessage").style.display = "none";
  document.getElementById("gameOverMessage").style.display = "none";
  document.getElementById("stoppedMessage").style.display = "none";
  document.getElementById("youWinMessage").style.display = "none"; // Hide the win message at start
  document.getElementById("moves").textContent = 0;
  moves = 0;
  matchedPairs = 0;
  gamePaused = false;
  stopPlayBtn.textContent = "pause 🛑";
  stopPlayBtn.style.background = "#2196F3";
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  // Shuffle cards
  cards = shuffle(cards);
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  flippedCards = [];

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function toggleGame() {
  if (gamePaused) {
    // Resume Game
    gamePaused = false;
    stopPlayBtn.textContent = "pause 🛑";
    stopPlayBtn.style.background = "#2196F3";
    document.getElementById("stoppedMessage").style.display = "none";
    timerInterval = setInterval(updateTimer, 1000);
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", flipCard));
  } else {
    // Pause Game
    gamePaused = true;
    stopPlayBtn.textContent = "Play ▶️";
    stopPlayBtn.style.background = "#4CAF50";
    clearInterval(timerInterval);
    document.getElementById("stoppedMessage").style.display = "block";
    document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", flipCard));
  }
}

function updateTimer() {
  if (timeLeft > 0 && !gamePaused) {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
  } else {
    clearInterval(timerInterval);
    if (!gamePaused) {
      document.getElementById("gameOverMessage").style.display = "block";
      document.querySelectorAll(".card").forEach(card => card.removeEventListener("click", flipCard));
    }
  }
}

function flipCard() {
  if (flippedCards.length >= 2 || this.classList.contains("flipped") || gamePaused) return;
  flipSound.play();

  this.classList.add("flipped");
  this.textContent = this.dataset.emoji;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchSound.play();
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    timeLeft += 5;
    document.getElementById("time").textContent = timeLeft;
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
    }, 800);
  }

  // If all pairs are matched, show the win message
  if (matchedPairs === cards.length / 2) {
    document.getElementById("youWinMessage").style.display = "block";
    winSound.play();
  }
  flippedCards = [];
}

startGame();
