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

    }
}