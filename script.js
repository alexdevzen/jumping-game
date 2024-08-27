// DOM elements
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles-container');
const startButton = document.getElementById('start-button');

// Audio elements
const jumpSound = new Audio('./sounds/jump-sound.mp3');
const hitSound = new Audio('./sounds/hit-sound.mp3');

// State variables
let isJumping = false;
let isFalling = false;
let score = 0;
let obstacles = [];
let isGameRunning = false;
let gameInterval;
let canJump = true;
let jumpCooldown = 500; // Timeout in milliseconds between hops

// Event listeners
window.addEventListener('touchstart', handleTouchStart);
document.addEventListener('keydown', handleKeyDown);
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
  isFalling = false;
  canJump = true;
  score = 0;
  scoreElement.textContent = score;
  clearObstacles();
}

// Function to handle key press events
function handleKeyDown(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    tryJump();
  }
}

// Function to handle touch events
function handleTouchStart(event) {
  if (isGameRunning) {
    event.preventDefault();
    tryJump();
  }
}

// Function to attempt a jump
function tryJump() {
  if (canJump && !isJumping && !isFalling && isGameRunning) {
    jump();
    canJump = false;
    setTimeout(() => {
      canJump = true;
    }, jumpCooldown);
  }
}

// Function to handle character jump
function jump() {
  isJumping = true;
  isFalling = false;
  character.classList.add('jumping');
  playAudio(jumpSound);
  switchCharacterImage("url('./images/runner-jump.png')");

  setTimeout(() => {
    isJumping = false;
    isFalling = true;
    character.classList.remove('jumping');
    character.classList.add('falling');
  }, 300);

  setTimeout(() => {
    endJump();
  }, 600); // Adjust this value if necessary to sync with CSS animation
}

// Function to end the jump
function endJump() {
  character.classList.remove('jumping', 'falling');
  isFalling = false;

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
  isFalling = false;
  startButton.disabled = false;

  setTimeout(() => {
    switchCharacterImage("url('./images/runner-start.png')");
    alert('Game Over! Your score: ' + score);
    clearObstacles();
  }, 250);
}