//  DOM elements
/* Here we get references to DOM elements and set initial state variables. */
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles-container');
const startButton = document.getElementById('start-button');
const body = document.body;

//  state variables
let isJumping = false;
let score = 0;
let obstacles = [];
let isGameRunning = false;
let gameInterval;

// Audio elements
const jumpSound = new Audio('./sounds/jump-sound.mp3');
const hitSound = new Audio('./sounds/hit-sound.mp3');

// Add a universal touch event listener
window.addEventListener('touchstart', handleTouchStart);

// Function to start the game
function startGame() {
  if (isGameRunning) return;
  isGameRunning = true;
  score = 0;
  scoreElement.textContent = score;
  startButton.disabled = true;

  // Switch to GIF when the game starts
  character.style.backgroundImage = "url('./images/runner.gif')";

  createObstacles();
  gameInterval = setInterval(() => {
    moveObstacles();
    checkCollisions();
  }, 20);
}

// Function character jump

/* This function handles the character's jumping. Use CSS transition for the jump. */
function jump() {
  if (isJumping || !isGameRunning) return;
  isJumping = true;
  character.classList.add('jumping');

  // Play jump sound
  jumpSound.currentTime = 0; // Reset sound to start
  jumpSound.play();

  // Switch to the static "jump" image on jumping
  character.style.backgroundImage = "url('./images/runner-jump.png')";
  setTimeout(() => {
    character.classList.remove('jumping');
    setTimeout(() => {
      isJumping = false;
      // Switch back to GIF if the game is still running
      if (isGameRunning)
        character.style.backgroundImage = "url('./images/runner.gif')";
    }, 300); // Wait for the transition to finish
  }, 300);
}

// Function: Create Obstacle
function createObstacles() {
  // Clear existing obstacles
  obstacles.forEach((obstacle) => obstaclesContainer.removeChild(obstacle));
  obstacles = [];

  for (let i = 0; i < 3; i++) {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${800 + i * 300}px`; // Position obstacles offscreen initially
    obstaclesContainer.appendChild(obstacle);
    obstacles.push(obstacle);
  }
}

// Move the obstacle

/* This function moves the obstacle from right to left and resets its position when it leaves the screen. */
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    let obstacleLeft = parseInt(
      window.getComputedStyle(obstacle).getPropertyValue('left')
    );

    if (obstacleLeft <= -20) {
      // Reset position and increase score
      obstacle.style.left = '800px';
      score++;
      scoreElement.textContent = score;
    } else {
      // Move obstacle to the left
      obstacle.style.left = obstacleLeft - 5 + 'px';
    }
  });
}

// Detect collisions

/* Check if the character has collided with the obstacle. */
function checkCollisions() {
  obstacles.forEach((obstacle) => {
    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Adding a margin of 10 pixels to allow closer proximity
    let collisionMargin = 10;

    if (
      characterRect.right > obstacleRect.left + collisionMargin &&
      characterRect.left < obstacleRect.right - collisionMargin &&
      characterRect.bottom > obstacleRect.top + collisionMargin &&
      characterRect.top < obstacleRect.bottom - collisionMargin
    ) {
      // Play hit sound
      hitSound.currentTime = 0; // Reset sound to start
      hitSound.play();
      // Switch to the static "hit" image on collision
      if (isGameRunning) {
        character.style.backgroundImage = "url('./images/runner-hit.png')";
        endGame();
      }
    }
  });
}

// Function to end the game
function endGame() {
  clearInterval(gameInterval);
  isGameRunning = false;
  startButton.disabled = false;

  setTimeout(() => {
    // Switch back to the static image after a short delay
    character.style.backgroundImage = "url('./images/runner-start.png')";
    alert('Game Over! Your score: ' + score);
    createObstacles();
  }, 250);
}

// Event listener for spacebar press

/* Listen for key presses to trigger the jump when the space bar is pressed. */
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent default spacebar behavior
    jump();
  }
});

// Function to handle touch events
function handleTouchStart(event) {
  // Prevent default behavior on touch only if the game is running
  if (isGameRunning) {
    event.preventDefault();
    jump();
  }
}

// Event listener for start button
startButton.addEventListener('click', startGame);

/* The game works like this:

- The game starts when the player clicks the "Start Game" button.
- The character is in a fixed position horizontally and appears to be running due to the GIF animation.
- Obstacles move from right to left.
- The player can make the character jump with the space bar.
- If the character hits an obstacle, the game ends.
- The score increases each time an obstacle is completely passed.
- The game can be restarted after it ends by clicking the "Start Game" button again. */
