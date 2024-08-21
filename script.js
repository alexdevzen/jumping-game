//  DOM elements

/* Here we get references to DOM elements and set initial state variables. */
const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');

//  state variables
let isJumping = false;
let score = 0;
let obstacles = [];
let obstacleStartPositions = []; // To keep track of initial positions


// Function character jump

/* This function handles the character's jumping. Use setInterval to animate the jump in small increments. */
function jump() {
  if (isJumping) return;
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
  obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
  obstacles = [];
  obstacleStartPositions = []; // Reset positions

  for (let i = 0; i < 3; i++) {
      const obstacle = document.createElement('div');
      obstacle.classList.add('obstacle');
      obstacle.style.background = "black";
      obstacle.style.right = `${i * 300}px`; // Position obstacles with some spacing
      obstacle.style.bottom = '0px';
      gameContainer.appendChild(obstacle);
      obstacles.push(obstacle);
      
      // Record initial positions for later checks
      let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
      obstacleStartPositions.push(obstacleRight);
  }
}

// Move the obstacle

/* This function moves the obstacle from right to left and resets its position when it leaves the screen. */
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
      let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
      
      if (obstacleRight > 800) {
          // Reset position and increase score only if it was not already reset
          obstacle.style.right = '0px';
          if (obstacleRight > obstacleStartPositions[index]) { // Ensure score increments only when passing obstacles
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
          alert('Game Over! Your score: ' + score);
          score = 0;
          scoreElement.textContent = score;
          resetObstacles(); // Reset obstacles after collision
      }
  });
}

function resetObstacles() {
  obstacles.forEach((obstacle, index) => {
      // Reset each obstacle to a different starting position with spacing
      obstacle.style.right = `${index * 400}px`;
  });
}




// Event listener for spacebar press

/* Listen for key presses to trigger the jump when the space bar is pressed. */
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

// Initialize game
createObstacles();

// Main loop

/* This interval executes the movement and collision functions every 20 milliseconds, creating the game's animation. */
setInterval(() => {
  moveObstacles();
  checkCollisions();
}, 20);

/* The game works like this:

- The character is in a fixed position horizontally.
- Obstacles move from right to left.
- The player can make the character jump with the space bar.
- If the character hits an obstacle, the game ends.
- The score increases each time an obstacle is completely passed. */