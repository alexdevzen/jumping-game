//  DOM elements

/* Here we get references to DOM elements and set initial state variables. */
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles-container');
const startButton = document.getElementById('start-button');

//  state variables
let isJumping = false;
let score = 0;
let obstacles = [];
let isGameRunning = false;
let gameInterval;
let obstacleInterval;

// Function to start the game
function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    startButton.disabled = true;
    obstacles = [];
    obstaclesContainer.innerHTML = '';
    gameInterval = setInterval(gameLoop, 20);
    scheduleNextObstacle();
}

// Main game loop
function gameLoop() {
    moveObstacles();
    checkCollisions();
}

// Function to schedule the next obstacle
function scheduleNextObstacle() {
    if (!isGameRunning) return;
    const minDelay = 1000; // Minimum delay of 1 second
    const maxDelay = 3000; // Maximum delay of 3 seconds
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    obstacleInterval = setTimeout(() => {
        createObstacle();
        scheduleNextObstacle();
    }, delay);
}

// Function character jump

/* This function handles the character's jumping. Use setInterval to animate the jump in small increments. */
function jump() {
    if (isJumping || !isGameRunning) return;
    isJumping = true;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
        if (jumpCount < 20) {
            character.style.bottom = (characterTop + 5) + 'px';
            jumpCount++;
        } else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
                if (characterTop <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                } else {
                    character.style.bottom = (characterTop - 5) + 'px';
                }
            }, 20);
        }
    }, 20);
}

// Function: Create Obstacle
function createObstacle() {
    const gameWidth = 800; // Width of the game container
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${gameWidth}px`;
    obstacle.style.bottom = '0px';
    obstacle.dataset.passed = 'false';
    obstaclesContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Move the obstacles

/* This function moves the obstacles from right to left and removes them when they leave the screen. */
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        if (obstacleLeft <= -20) {
            // Remove obstacle that has left the screen
            obstaclesContainer.removeChild(obstacle);
            obstacles.splice(index, 1);
        } else {
            // Move obstacle to the left
            obstacle.style.left = (obstacleLeft - 5) + 'px';

            // Check if the obstacle has passed the character and hasn't been counted yet
            if (obstacleLeft < 50 && obstacle.dataset.passed === 'false') {
                score++;
                scoreElement.textContent = score;
                obstacle.dataset.passed = 'true'; // Mark the obstacle as passed
            }
        }
    });
}

// Detect collisions

/* Check if the character has collided with any obstacle. */
function checkCollisions() {
    obstacles.forEach(obstacle => {
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
        let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
        let characterRight = characterLeft + 40;

        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        let obstacleRight = obstacleLeft + 20;
        let obstacleTop = 40; // Obstacle height is 40px

        // Check if there's a collision
        if (characterRight > obstacleLeft && characterLeft < obstacleRight && characterTop < obstacleTop) {
            endGame();
        }
    });
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    clearTimeout(obstacleInterval);
    isGameRunning = false;
    startButton.disabled = false;
    alert('Game Over! Your score: ' + score);
}

// Event listener for spacebar press

/* Listen for key presses to trigger the jump when the space bar is pressed. */
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

// Event listener for start button
startButton.addEventListener('click', startGame);

/* The game works like this:

- The game starts when the player clicks the "Start Game" button.
- The character is in a fixed position horizontally.
- Obstacles appear from the right at random intervals and move to the left.
- The player can make the character jump with the space bar.
- If the character hits an obstacle, the game ends.
- The score increases each time an obstacle is completely passed.
- The game can be restarted after it ends by clicking the "Start Game" button again. */