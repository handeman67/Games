let game = {
  ball: {
    element: document.getElementById("ball"),
    x: 390,
    y: 300,
    dx: 4,
    dy: -4,
    size: 20 },

  paddle: {
    element: document.getElementById("paddle"),
    x: 350,
    width: 100,
    height: 15,
    speed: 5 },

  score: 0,
  lives: 3,
  blocks: [],
  gameRunning: false,
  keys: {} };


const gameContainer = document.getElementById("gameContainer");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const gameOverElement = document.getElementById("gameOver");
const gameWonElement = document.getElementById("gameWon");

// Create blocks
function createBlocks() {
  const colors = ["red", "orange", "yellow", "green", "blue"];
  const blockWidth = 75;
  const blockHeight = 30;
  const padding = 5;
  const startY = 80;

  game.blocks = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const block = document.createElement("div");
      block.className = `block ${colors[row]}`;
      block.style.left = col * (blockWidth + padding) + 40 + "px";
      block.style.top = row * (blockHeight + padding) + startY + "px";

      gameContainer.appendChild(block);
      game.blocks.push({
        element: block,
        x: col * (blockWidth + padding) + 40,
        y: row * (blockHeight + padding) + startY,
        width: blockWidth,
        height: blockHeight,
        destroyed: false });

    }
  }
}

// Initialize game
function initGame() {
  game.score = 0;
  game.lives = 3;
  game.ball.x = 390;
  game.ball.y = 300;
  game.ball.dx = 4;
  game.ball.dy = -4;
  game.paddle.x = 550;
  game.gameRunning = true;

  updateDisplay();
  createBlocks();
  gameOverElement.style.display = "none";
  gameWonElement.style.display = "none";
}

// Update display elements
function updateDisplay() {
  scoreElement.textContent = game.score;
  livesElement.textContent = game.lives;

  game.ball.element.style.left = game.ball.x + "px";
  game.ball.element.style.top = game.ball.y + "px";

  game.paddle.element.style.left = game.paddle.x + "px";
}

// Check collision between ball and rectangle
function checkCollision(
ballX,
ballY,
ballSize,
rectX,
rectY,
rectWidth,
rectHeight)
{
  return (
    ballX < rectX + rectWidth &&
    ballX + ballSize > rectX &&
    ballY < rectY + rectHeight &&
    ballY + ballSize > rectY);

}
const level = "easy";
// Handle ball collisions
function handleCollisions() {
  // Wall collisions
  if (game.ball.x <= 0 || game.ball.x >= 780) {
    game.ball.dx = -game.ball.dx;
  }
  if (game.ball.y <= 0) {
    game.ball.dy = -game.ball.dy;
  }

  // Bottom wall (lose life)
  if (game.ball.y >= 580) {
    game.lives--;
    if (game.lives <= 0) {
      gameOver();
    } else {
      if (level == "easy") {
        game.ball.dy = -game.ball.dy;
      }
      if (level == "hard") {
        resetBall();
      }
    }
  }

  // Paddle collision
  if (
  checkCollision(
  game.ball.x,
  game.ball.y,
  game.ball.size,
  game.paddle.x,
  570,
  game.paddle.width,
  game.paddle.height))

  {
    game.ball.dy = -Math.abs(game.ball.dy);

    // Add angle based on where ball hits paddle
    const paddleCenter = game.paddle.x + game.paddle.width / 2;
    const ballCenter = game.ball.x + game.ball.size / 2;
    const difference = ballCenter - paddleCenter;
    game.ball.dx = difference * 0.1;
  }

  // Block collisions
  game.blocks.forEach(block => {
    if (
    !block.destroyed &&
    checkCollision(
    game.ball.x,
    game.ball.y,
    game.ball.size,
    block.x,
    block.y,
    block.width,
    block.height))

    {
      block.destroyed = true;
      block.element.classList.add("exploding");

      setTimeout(() => {
        if (block.element.parentNode) {
          gameContainer.removeChild(block.element);
        }
      }, 500);

      game.ball.dy = -game.ball.dy;
      game.score += 10;

      // Check if all blocks destroyed
      if (game.blocks.every(b => b.destroyed)) {
        gameWon();
      }
    }
  });
}

// Reset ball position
function resetBall() {
  game.ball.x = 390;
  game.ball.y = 300;
  game.ball.dx = 2;
  game.ball.dy = -2;
}

// Game over
function gameOver() {
  game.gameRunning = false;
  gameOverElement.style.display = "block";
}

// Game won
function gameWon() {
  game.gameRunning = false;
  gameWonElement.style.display = "block";
}

// Restart game
function restartGame() {
  // Clear existing blocks
  game.blocks.forEach(block => {
    if (block.element.parentNode) {
      gameContainer.removeChild(block.element);
    }
  });

  return initGame(), gameLoop();
}

// Handle keyboard input
document.addEventListener("keydown", e => {
  game.keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  game.keys[e.key] = false;
});

// Update paddle position
function updatePaddle() {
  if (game.keys["ArrowLeft"] || game.keys["a"] || game.keys["A"]) {
    game.paddle.x = Math.max(0, game.paddle.x - game.paddle.speed);
  }
  if (game.keys["ArrowRight"] || game.keys["d"] || game.keys["D"]) {
    game.paddle.x = Math.min(
    800 - game.paddle.width,
    game.paddle.x + game.paddle.speed);

  }
}

// Game loop
function gameLoop() {
  if (!game.gameRunning) return;

  updatePaddle();

  // Move ball
  game.ball.x += game.ball.dx;
  game.ball.y += game.ball.dy;

  handleCollisions();
  updateDisplay();

  requestAnimationFrame(gameLoop);
}

// Start the game
initGame();
gameLoop();
// Restart button
document.getElementById("restartButton").addEventListener("click", restartGame);

// Mobile controls (coming soon)
document.getElementById("mobileLeft").addEventListener("touchstart", () => {
  game.keys["ArrowLeft"] = true;
});
document.getElementById("mobileRight").addEventListener("touchstart", () => {
  game.keys["ArrowRight"] = true;
});
document.getElementById("mobileLeft").addEventListener("touchend", () => {
  game.keys["ArrowLeft"] = false;
});
document.getElementById("mobileRight").addEventListener("touchend", () => {
  game.keys["ArrowRight"] = false;
});

// Mobile controls for paddle movement
document.addEventListener("touchmove", e => {
  if (game.gameRunning) {
    const touchX = e.touches[0].clientX - gameContainer.offsetLeft;
    game.paddle.x = Math.max(
    0,
    Math.min(800 - game.paddle.width, touchX - game.paddle.width / 2));
    
    updateDisplay();
  }
}); 
document.addEventListener("touchstart", e => {
  if (game.gameRunning) {
    const touchX = e.touches[0].clientX - gameContainer.offsetLeft;
    game.paddle.x = Math.max(
    0,
    Math.min(800 - game.paddle.width, touchX - game.paddle.width / 2));
    
    updateDisplay();
  }
});
