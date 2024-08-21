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
let obstacleStartPositions = []; // To keep track of initial positions
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
function createObstacles() {
    // Clear existing obstacles
    obstacles.forEach(obstacle => obstaclesContainer.removeChild(obstacle));
    obstacles = [];
    obstacleStartPositions = []; // Reset positions

    for (let i = 0; i < 3; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.right = `${800 + (i * 300)}px`; // Position all obstacles offscreen initially
        obstacle.style.bottom = '0px';
        obstaclesContainer.appendChild(obstacle);
        obstacles.push(obstacle);

        // Record initial positions for later checks
        obstacleStartPositions.push(false); // Use boolean to track if obstacle has entered screen
    }
}

// Move the obstacle

/* This function moves the obstacle from right to left and resets its position when it leaves the screen. */
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));

        if (obstacleRight > 800) {
            // Mark that the obstacle has entered the screen
            obstacleStartPositions[index] = true;
        }

        if (obstacleRight > 820) { // Fully passed the screen width (800px) plus obstacle width (20px)
            // Reset position
            obstacle.style.right = '0px';
            // Increase score only if the obstacle had entered the screen before
            if (obstacleStartPositions[index]) {
                score++;
                scoreElement.textContent = score;
            }
        } else {
            // Move obstacle to the left
            obstacle.style.right = (obstacleRight + 5) + 'px';
        }
    });
}

// Detect collisions

/* Check if the character has collided with the obstacle. */
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

function resetObstacles() {
    obstacles.forEach((obstacle, index) => {
        // Reset each obstacle to a different starting position with spacing
        obstacle.style.right = `${800 + (index * 300)}px`;
        obstacleStartPositions[index] = false;
    });
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startButton.disabled = false;
    alert('Game Over! Your score: ' + score);
    score = 0;
    scoreElement.textContent = score;
    resetObstacles();
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
- Obstacles move from right to left.
- The player can make the character jump with the space bar.
- If the character hits an obstacle, the game ends.
- The score increases each time an obstacle is completely passed.
- The game can be restarted after it ends by clicking the "Start Game" button again. */