//  DOM elements

/* Here we get references to DOM elements and set initial state variables. */
const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');

//  state variables
let isJumping = false;
let score = 0;


// Function character jump

/* This function handles the character's jumping. Use setInterval to animate the jump in small increments. */
function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
        // Ascending
        if (jumpCount < 20) {
            characterTop += 5;
            character.style.bottom = characterTop + 'px';
            jumpCount++;
        }
        // Descending
        else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                if (characterTop <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                } else {
                    characterTop -= 5;
                    character.style.bottom = characterTop + 'px';
                }
            }, 20);
        }
    }, 20);
}

// Move the obstacle

/* This function moves the obstacle from right to left and resets its position when it leaves the screen. */
function moveObstacle() {
    let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    if (obstacleRight > 800) {
        // Reset position, increase score
        obstacle.style.right = '0px';
        score++;
        scoreElement.textContent = score;
    } else {
        // Move obstacle to the left
        obstacle.style.right = (obstacleRight + 5) + 'px';
    }
}



// Detect collisions

/* Check if the character has collided with the obstacle. */
function checkCollision() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('left')) + 40;

    // Check if there's a collision
    if (characterRight > obstacleLeft && characterTop >= 160) {
        alert('Game Over! Your score: ' + score);
        // Reset the game
        score = 0;
        scoreElement.textContent = score;
        obstacle.style.right = '0px';
    }
}




// Event listener for spacebar press

/* Listen for key presses to trigger the jump when the space bar is pressed. */
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

// Main loop

/* This interval executes the movement and collision functions every 20 milliseconds, creating the game's animation. */
setInterval(() => {
    moveObstacle();
    checkCollision();
}, 20);


/* The game works like this:

- The character is in a fixed position horizontally.
- Obstacles move from right to left.
- The player can make the character jump with the space bar.
- If the character hits an obstacle, the game ends.
- The score increases each time an obstacle is completely passed. */