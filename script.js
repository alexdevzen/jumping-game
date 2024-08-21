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

// Function to start the game
function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    startButton.disabled = true;
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
    setTimeout(() => {
        character.classList.remove('jumping');
        setTimeout(() => {
            isJumping = false;
        }, 300); // Wait for the transition to finish
    }, 300);
}

// Function: Create Obstacle
function createObstacles() {
    // Clear existing obstacles
    obstacles.forEach(obstacle => obstaclesContainer.removeChild(obstacle));
    obstacles = [];

    for (let i = 0; i < 3; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${800 + (i * 300)}px`; // Position obstacles offscreen initially
        obstaclesContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
}

// Move the obstacle

/* This function moves the obstacle from right to left and resets its position when it leaves the screen. */
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        if (obstacleLeft <= -20) {
            // Reset position and increase score
            obstacle.style.left = '800px';
            score++;
            scoreElement.textContent = score;
        } else {
            // Move obstacle to the left
            obstacle.style.left = (obstacleLeft - 5) + 'px';
        }
    });
}

// Detect collisions

/* Check if the character has collided with the obstacle. */
function checkCollisions() {
    obstacles.forEach(obstacle => {
        let characterRect = character.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();

        if (
            characterRect.right > obstacleRect.left &&
            characterRect.left < obstacleRect.right &&
            characterRect.bottom > obstacleRect.top &&
            characterRect.top < obstacleRect.bottom
        ) {
            endGame();
        }
    });
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startButton.disabled = false;
    alert('Game Over! Your score: ' + score);
}

// Event listener for spacebar press

/* Listen for key presses to trigger the jump when the space bar is pressed. */
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar behavior
        jump();
    }
});

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