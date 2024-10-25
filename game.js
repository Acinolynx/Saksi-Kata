let currentWord;
let timeLimit = 30; // Time limit in seconds
let timer; // Variable to hold the timer interval
let correctGuesses = 0; // Store the number of correctly guessed words
let lives = 6; // Initialize lives
const bgm = document.getElementById("bgm");

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", restartGame);
document
  .getElementById("refresh-word-btn")
  .addEventListener("click", chooseRandomWord); // Add event listener for refresh button

// Play BGM when the page loads and loop
window.addEventListener("load", () => {
  bgm.volume = 0.2; // Set BGM volume to 20%
  bgm.loop = true; // Set BGM to loop
  bgm.play(); // Play BGM
});

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game").style.display = "block";
  chooseRandomWord();
  setupKeyboard();
  document.getElementById("time-limit").textContent = timeLimit; // Display initial time limit
  document.getElementById("lives").textContent = lives; // Display initial lives
  document.getElementById("notification").style.display = "none"; // Hide notification
  startTimer(); // Start the timer
}

function chooseRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex].word;
  document.querySelector(".hint-text b").textContent = words[randomIndex].hint;

  const wordDisplay = document.querySelector(".word-display");
  wordDisplay.innerHTML = "";

  // Display letters of the selected word horizontally
  for (let i = 0; i < currentWord.length; i++) {
    const li = document.createElement("li");
    li.textContent = "_";
    wordDisplay.appendChild(li);
  }
  resetKeyboard(); // Reset keyboard for each word change
}

function setupKeyboard() {
  const keyboardContainer = document.querySelector(".keyboard");
  keyboardContainer.innerHTML = "";

  // QWERTY Keyboard layout
  const keys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  keys.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.split("").forEach((letter) => {
      const button = document.createElement("button");
      button.classList.add("key");
      button.innerText = letter;
      button.dataset.letter = letter;

      button.addEventListener("click", (event) => {
        const guessedLetter = event.target.dataset.letter;
        processGuess(guessedLetter);
        button.disabled = true; // Disable button after click
      });

      rowDiv.appendChild(button); // Add button to the keyboard row
    });

    keyboardContainer.appendChild(rowDiv); // Add row to the keyboard
  });
}

function resetKeyboard() {
  const buttons = document.querySelectorAll(".keyboard button");
  buttons.forEach((button) => {
    button.disabled = false; // Enable all buttons
  });
}

function processGuess(letter) {
  let isCorrect = false;

  currentWord.split("").forEach((currentLetter, index) => {
    if (currentLetter === letter) {
      document.querySelector(
        ".word-display li:nth-child(" + (index + 1) + ")"
      ).textContent = currentLetter;
      isCorrect = true;
    }
  });

  if (!isCorrect) {
    lives--; // Decrease lives if the guess is wrong
    document.getElementById("lives").textContent = lives; // Update displayed lives
    showNotification(`Salah! Huruf ${letter} tidak ada.`, "error");

    // Check if lives are exhausted
    if (lives <= 0) {
      alert("Anda kehabisan nyawa! Kata yang benar adalah " + currentWord);
      endGame(); // End game if lives reach zero
    }
  } else {
    showNotification(`Benar! Huruf ${letter} ada.`, "success");
  }

  checkGameOver();
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.color = type === "error" ? "#f00" : "#0f0"; // Red for error, green for correct
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 2000); // Show notification for 2 seconds
}

function checkGameOver() {
  const displayedWord = Array.from(
    document.querySelectorAll(".word-display li")
  )
    .map((li) => li.textContent)
    .join("");

  if (displayedWord === currentWord) {
    correctGuesses++; // Increment the number of correctly guessed words
    if (correctGuesses < 10) {
      alert(`Kata yang benar! Total benar: ${correctGuesses}`);
      chooseRandomWord(); // Choose a new word
    } else {
      endGame(); // End the game if 10 words guessed
    }
  }

  // Check if time limit reached (checkGameOver is called every guess)
  if (timeLimit <= 0) {
    alert("Waktu habis! Kata yang benar adalah " + currentWord);
    endGame();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLimit--; // Decrease time limit
    document.getElementById("time-limit").textContent = timeLimit; // Update displayed time limit

    if (timeLimit <= 0) {
      clearInterval(timer); // Stop the timer
      checkGameOver(); // Check if the game is over
    }
  }, 1000); // Update every second
}

function endGame() {
  clearInterval(timer); // Stop the timer
  document.getElementById("game").style.display = "none"; // Hide game
  document.getElementById("game-over-screen").style.display = "block"; // Show game over screen
  document.getElementById(
    "final-score"
  ).textContent = `Anda berhasil menebak ${correctGuesses} kata!`;
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  timeLimit = 30; // Reset time limit
  correctGuesses = 0; // Reset number of correctly guessed words
  lives = 6; // Reset lives
  document.getElementById("time-limit").textContent = timeLimit; // Display time limit
  document.getElementById("lives").textContent = lives; // Display lives
}
