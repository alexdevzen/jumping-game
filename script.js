// References to DOM
const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');

//State variables
let isJumping = false;
let score = 0;

function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));

        //Ascending
        if (jumpCount < 20) {
            characterTop += 5;
            character.style.bottom = characterTop + 'px';
            jumpCount++;
        }
        //Descending
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

function moveObstacle() {
    let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    if (obstacleRight > 800) {
        // Reset obstacle position and increase score
        obstacle.style.right = '0px';
        score++;
        scoreElement.textContent = score;
    } else {
        // move obstacle to the left
        obstacle.style.right = (obstacleRight + 5) + 'px';
    }
}

//Function to detect collisions
function checkCollision() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
    let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('left')) + 40;

    //check collision
    if (characterRight > obstacleLeft && characterTop >= 160) {
        alert('Game Over! Your score: ' + score);
        //reset game
        score = 0;
        scoreElement.textContent = score;
        obstacle.style.right = 'opx';
    }
}

//Listener spacebar press
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

//Loop
setInterval(() => {
    moveObstacle();

}, 20);