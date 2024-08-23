// DOM elements
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles-container');
const startButton = document.getElementById('start-button');

// Audio elements
const jumpSound = new Audio('./sounds/jump-sound.mp3');
const hitSound = new Audio('./sounds/hit-sound.mp3');

// State variables
let isJumping = false;
let score = 0;
let obstacles = [];
let isGameRunning = false;
let gameInterval;

// Event listeners
window.addEventListener('touchstart', handleTouchStart);
document.addEventListener('keydown', handleKeyPress);
startButton.addEventListener('click', startGame);

// Function to start the game
function startGame() {
  if (isGameRunning) return;

  resetGame();
  startButton.disabled = true;
  character.style.backgroundImage = "url('./images/runner.gif')";

  createObstacles();
  gameInterval = setInterval(gameLoop, 20);
}

// Main game loop
function gameLoop() {
  moveObstacles();
  checkCollisions();
}

// Function to reset game state
function resetGame() {
  isGameRunning = true;
  isJumping = false;
  score = 0;
  scoreElement.textContent = score;
  clearObstacles();
}

// Function to handle key press events
function handleKeyPress(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    jump();
  }
}

// Function to handle touch events
function handleTouchStart(event) {
  if (isGameRunning) {
    event.preventDefault();
    jump();
  }
}

// Function to handle character jump
function jump() {
  if (isJumping || !isGameRunning) return;

  isJumping = true;
  character.classList.add('jumping');
  playAudio(jumpSound);
  switchCharacterImage("url('./images/runner-jump.png')");

  setTimeout(endJump, 300);
}

// Function to end the jump
function endJump() {
  character.classList.remove('jumping');
  isJumping = false;

  if (isGameRunning) {
    switchCharacterImage("url('./images/runner.gif')");
  }
}

// Function to switch character image
function switchCharacterImage(imageUrl) {
  character.style.backgroundImage = imageUrl;
}

// Function to play audio
function playAudio(audioElement) {
  audioElement.currentTime = 0;
  audioElement.play();
}

// Function to create obstacles
function createObstacles() {
  for (let i = 0; i < 3; i++) {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${800 + i * 300}px`;
    obstaclesContainer.appendChild(obstacle);
    obstacles.push(obstacle);
  }
}

// Function to clear existing obstacles
function clearObstacles() {
  obstacles.forEach((obstacle) => obstaclesContainer.removeChild(obstacle));
  obstacles = [];
}

// Function to move obstacles
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    let obstacleLeft = parseInt(
      window.getComputedStyle(obstacle).getPropertyValue('left')
    );

    if (obstacleLeft <= -20) {
      obstacle.style.left = '800px';
      increaseScore();
    } else {
      obstacle.style.left = `${obstacleLeft - 5}px`;
    }
  });
}

// Function to increase score
function increaseScore() {
  score++;
  scoreElement.textContent = score;
}

// Function to check collisions
function checkCollisions() {
  obstacles.forEach((obstacle) => {
    if (isCollision(character, obstacle)) {
      playAudio(hitSound);
      switchCharacterImage("url('./images/runner-hit.png')");
      endGame();
    }
  });
}

// Function to detect collision between two elements
function isCollision(character, obstacle) {
  const characterRect = character.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  const collisionMargin = 10;

  return (
    characterRect.right > obstacleRect.left + collisionMargin &&
    characterRect.left < obstacleRect.right - collisionMargin &&
    characterRect.bottom > obstacleRect.top + collisionMargin &&
    characterRect.top < obstacleRect.bottom - collisionMargin
  );
}

// Function to end the game
function endGame() {
  clearInterval(gameInterval);
  isGameRunning = false;
  isJumping = false;
  startButton.disabled = false;

  setTimeout(() => {
    switchCharacterImage("url('./images/runner-start.png')");
    alert('Game Over! Your score: ' + score);
    clearObstacles();
  }, 250);
}
