const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const altitudeText = document.getElementById("altitudeText");
const progressText = document.getElementById("progressText");
const restartBtn = document.getElementById("restartBtn");
const motivationalText = document.getElementById("motivationalText");
const winOverlay = document.getElementById("winOverlay");
const playAgainBtn = document.getElementById("playAgainBtn");
const winTimeText = document.getElementById("winTime");
const winFallsText = document.getElementById("winFalls");

const gravity = 0.35;
const friction = 0.985;
const groundFriction = 0.92;

let cameraY = 0;
let gameWon = false;
let startTime = Date.now();
let fallCount = 0;
let highestAltitudeReached = 0;
let lastPlayerY = 0;
let particles = [];

let playerX = 450;
let playerY = 470;
let playerRadius = 24;
let playerVx = 0;
let playerVy = 0;
let isGrounded = false;

const hammerMaxLength = 95;
const hammerMinLength = 35;
const hammerHeadRadius = 14;

let hammerAngle = -Math.PI / 2;
let hammerTipX = playerX;
let hammerTipY = playerY - hammerMaxLength;
let prevHammerTipX = hammerTipX;
let prevHammerTipY = hammerTipY;

const platforms = [
  { x: 0, y: 520, width: 900, height: 150, color: "#2d3436", type: "ground" },
  { x: 0, y: -2600, width: 45, height: 3200, color: "#1e272e", type: "wall" },
  { x: 855, y: -2600, width: 45, height: 3200, color: "#1e272e", type: "wall" },
  { x: 260, y: 440, width: 140, height: 80, color: "#485460", label: "Starter Rock" },
  { x: 500, y: 370, width: 160, height: 70, color: "#485460" },
  { x: 230, y: 280, width: 150, height: 50, color: "#485460" },
  { x: 520, y: 180, width: 140, height: 45, color: "#3d3d3d" },
  { x: 310, y: 80, width: 130, height: 40, color: "#3d3d3d" },
  { x: 100, y: -30, width: 150, height: 45, color: "#3d3d3d" },
  { x: 430, y: -140, width: 180, height: 50, color: "#3d3d3d" },
  { x: 670, y: -250, width: 140, height: 45, color: "#3d3d3d" },
  { x: 45, y: -400, width: 280, height: 50, color: "#2f3640" },
  { x: 575, y: -530, width: 280, height: 50, color: "#2f3640" },
  { x: 45, y: -670, width: 300, height: 50, color: "#2f3640" },
  { x: 555, y: -810, width: 300, height: 50, color: "#2f3640" },
  { x: 405, y: -950, width: 90, height: 45, color: "#57606f" },
  { x: 180, y: -1100, width: 250, height: 45, color: "#2f3640" },
  { x: 570, y: -1250, width: 140, height: 45, color: "#3d3d3d" },
  { x: 250, y: -1400, width: 170, height: 45, color: "#3d3d3d" },
  { x: 480, y: -1550, width: 190, height: 40, color: "#57606f" },
  { x: 190, y: -1700, width: 140, height: 45, color: "#3d3d3d" },
  { x: 520, y: -1860, width: 150, height: 45, color: "#2f3640" },
  { x: 320, y: -2010, width: 130, height: 45, color: "#3d3d3d" },
  { x: 490, y: -2170, width: 170, height: 45, color: "#2f3640" },
  { x: 250, y: -2380, width: 400, height: 60, color: "#d35400", type: "summit" }
];

const summitY = -2380;

let mouseScreenX = 450;
let mouseScreenY = 300;

function resetPlayer() {
  playerX = 450;
  playerY = 470;
  playerVx = 0;
  playerVy = 0;
  isGrounded = false;
  gameWon=false;
  startTime=Date.now();
  fallCount=0;
  highestAltitudeReached=0;
  lastPlayerY=playerY;
  winOverlay.classList.add("hidden");
  playAgainBtn.classList.add("hidden");
}

canvas.addEventListener("mousemove", function(event) {
  const rect = canvas.getBoundingClientRect();
  mouseScreenX = event.clientX - rect.left;
  mouseScreenY = event.clientY - rect.top;
});

window.addEventListener("keydown", function(event) {
  if (event.key === "r" || event.key === "R") {
    resetPlayer();
  }
});

restartBtn.addEventListener("click", resetPlayer);
playAgainBtn.addEventListener("click", resetPlayer);

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

function drawBackground() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (cameraY > 0) {
    skyGradient.addColorStop(0, "#1f293d");
    skyGradient.addColorStop(1, "#3b2a3a");
  } else if (cameraY > -1400) {
    skyGradient.addColorStop(0, "#0c1322");
    skyGradient.addColorStop(1, "#1e2a44");
  } else {
    skyGradient.addColorStop(0, "#050811");
    skyGradient.addColorStop(1, "#111827");
  }

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (cameraY < -300) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    for (let s = 0; s < 30; s++) {
      const starX = (s * 97) % canvas.width;
      const starY = ((s * 131) - cameraY * 0.15) % canvas.height;
      ctx.fillRect(starX, starY, 2, 2);
    }
  }
}


function drawPlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];
    ctx.fillStyle = p.color || "#3d3d3d";
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, p.width, p.height);

    if (p.type !== "wall") {
      ctx.fillStyle = p.y < -1200 ? "#ecf0f1" : "#27ae60";
      ctx.fillRect(p.x, p.y, p.width, 5);
    }
  }
}

function drawPlayerAndHammer() {
  ctx.fillStyle = "#2f3640";
  ctx.beginPath();
  ctx.arc(playerX, playerY + 4, playerRadius, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  ctx.save();
  ctx.translate(0, -cameraY);
  drawPlatforms();
  drawPlayerAndHammer();
  ctx.restore();
}

function gameLoop() {
  updatePhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);