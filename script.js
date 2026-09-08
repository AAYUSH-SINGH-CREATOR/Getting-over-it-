const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const altitudeText = document.getElementById("altitudeText");
const progressText = document.getElementById("progressText");
const restartBtn = document.getElementById("restartBtn");
const motivationalText = document.getElementById("motivationalText");

const gravity = 0.35;
const friction = 0.985;
const groundFriction = 0.92;

let playerX = 450;
let playerY = 470;
let playerRadius = 24;
let playerVx = 0;
let playerVy = 0;
let isGrounded = false;

function resetPlayer() {
  playerX = 450;
  playerY = 470;
  playerVx = 0;
  playerVy = 0;
  isGrounded = false;
}

function updatePhysics() {
  playerVy += gravity;

  playerVx *= friction;
  playerVy *= friction;

  if (isGrounded) {
    playerVx *= groundFriction;
  }

  playerX += playerVx;
  playerY += playerVy;
}

function drawPlayerAndHammer() {
  ctx.fillStyle = "#2f3640";
  ctx.beginPath();
  ctx.arc(playerX, playerY + 4, playerRadius, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawPlayerAndHammer();
}

function gameLoop() {
  updatePhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);