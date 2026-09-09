const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let mouseX = -1000;
let mouseY = -1000;

canvas.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

class Star {

  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.radius = Math.random() * 1 + 0.3;

    this.baseOpacity =
      Math.random() * 0.6 + 0.3;

    this.opacity = this.baseOpacity;

    this.twinkle = Math.random() * Math.PI * 2;
  }

  update() {

    this.twinkle += 0.02;
    let distance = Math.hypot(
      mouseX - this.x, mouseY - this.y);
    if (distance < 70) {
      this.opacity =
        0.5 +
        Math.sin(this.twinkle * 6) * 0.4;
    }
    else {
      this.opacity =
        this.baseOpacity +
        Math.sin(this.twinkle) * 0.5;
    }

  }

  draw() {

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(255,255,255,${this.opacity})`;

    ctx.fill();
  }
}



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

const platforms = [
  { x: 0, y: 520, width: 900, height: 150, color: "#2d3436", type: "ground" }
];

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

  isGrounded = false;

  if (playerY + playerRadius + 4 > 520) {
    playerY = 520 - playerRadius - 4;
    playerVy = 0;
    isGrounded = true;
  }

  if (playerX < 0 + playerRadius) {
    playerX = 0 + playerRadius;
    playerVx = 0;
  }
  if (playerX > 900 - playerRadius) {
    playerX = 900 - playerRadius;
    playerVx = 0;
  }
}

function drawPlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, p.width, p.height);
  }
}

function drawPlayerAndHammer() {
  ctx.fillStyle = "#2f3640";
  ctx.beginPath();
  ctx.arc(playerX, playerY + 4, playerRadius, 0, Math.PI * 2);
  ctx.fill();
}
const starsArray = [];

for (let i = 0; i < 3000; i++) {
  starsArray.push(new Star());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  starsArray.forEach(star => {
    star.draw();
  });

  drawPlatforms();
  drawPlayerAndHammer();
}

function gameLoop() {
  updatePhysics();
  starsArray.forEach(star => {
    star.update();
  });
  draw();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);