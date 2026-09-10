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

let mouseScreenX = 450;
let mouseScreenY = 300;

const hammerMaxLength = 95;
const hammerMinLength = 35;
const hammerHeadRadius = 14;

let hammerAngle = -Math.PI / 2;
let hammerTipX = playerX;
let hammerTipY = playerY - hammerMaxLength;
let prevHammerTipX = hammerTipX;
let prevHammerTipY = hammerTipY;

const summitY = -2380;

const platforms = [
  { x: 0, y: 520, width: 900, height: 150, color: "#2d3436", type: "ground" },
  { x: 0, y: -2600, width: 45, height: 3200, color: "#1e272e", type: "wall" },
  { x: 855, y: -2600, width: 45, height: 3200, color: "#1e272e", type: "wall" },

  { x: 260, y: 440, width: 140, height: 80, color: "#485460" },
  { x: 500, y: 370, width: 160, height: 70, color: "#485460" },
  { x: 230, y: 280, width: 150, height: 50, color: "#485460" },

  { x: 520, y: 180, width: 140, height: 45, color: "#3d3d3d" },
  { x: 310, y: 80, width: 130, height: 40, color: "#3d3d3d" },
  { x: 100, y: -30, width: 150, height: 45, color: "#3d3d3d" },
  { x: 430, y: -140, width: 180, height: 50, color: "#3d3d3d" },
  { x: 670, y: -250, width: 140, height: 45, color: "#3d3d3d" },

];

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

function resetPlayer() {
  playerX = 450;
  playerY = 470;
  playerVx = 0;
  playerVy = 0;
  isGrounded = false;
}

function checkCircleRectCollision(circleX, circleY, radius, rect) {
  const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));

  const diffX = circleX - closestX;
  const diffY = circleY - closestY;
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);

  if (distance < radius) {
    let nx = 0;
    let ny = -1;
    let overlap = radius - distance;

    if (distance > 0.001) {
      nx = diffX / distance;
      ny = diffY / distance;
    } else {
      const leftDist = circleX - rect.x;
      const rightDist = (rect.x + rect.width) - circleX;
      const topDist = circleY - rect.y;
      const bottomDist = (rect.y + rect.height) - circleY;

      const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
      if (minDist === topDist) { nx = 0; ny = -1; overlap = topDist + radius; }
      else if (minDist === bottomDist) { nx = 0; ny = 1; overlap = bottomDist + radius; }
      else if (minDist === leftDist) { nx = -1; ny = 0; overlap = leftDist + radius; }
      else { nx = 1; ny = 0; overlap = rightDist + radius; }
    }

    return {
      colliding: true,
      nx: nx,
      ny: ny,
      overlap: overlap,
      contactX: closestX,
      contactY: closestY
    };
  }

  return { colliding: false };
}

function handleHammerCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    const hit = checkCircleRectCollision(hammerTipX, hammerTipY, hammerHeadRadius, platform);

    if (hit.colliding) {
      hammerTipX += hit.nx * hit.overlap;
      hammerTipY += hit.ny * hit.overlap;

      playerX += hit.nx * hit.overlap * 0.85;
      playerY += hit.ny * hit.overlap * 0.85;

      playerVx += hit.nx * hit.overlap * 0.28;
      playerVy += hit.ny * hit.overlap * 0.28;

      const maxSpeed = 16;
      if (playerVx > maxSpeed) playerVx = maxSpeed;
      if (playerVx < -maxSpeed) playerVx = -maxSpeed;
      if (playerVy > maxSpeed) playerVy = maxSpeed;
      if (playerVy < -maxSpeed) playerVy = -maxSpeed;
    }
  }
}

function handlePlayerCollisions() {
  isGrounded = false;

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    const hit = checkCircleRectCollision(playerX, playerY, playerRadius, platform);

    if (hit.colliding) {
      playerX += hit.nx * hit.overlap;
      playerY += hit.ny * hit.overlap;

      const dot = playerVx * hit.nx + playerVy * hit.ny;
      if (dot < 0) {
        playerVx -= dot * hit.nx;
        playerVy -= dot * hit.ny;
      }

      if (hit.ny < -0.6) {
        isGrounded = true;
      }
    }
  }
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

  const dx = mouseScreenX - playerX;
  const dy = mouseScreenY - playerY;

  hammerAngle = Math.atan2(dy, dx);
  const mouseDistance = Math.sqrt(dx * dx + dy * dy);

  let currentReach = mouseDistance;
  if (currentReach > hammerMaxLength) currentReach = hammerMaxLength;
  if (currentReach < hammerMinLength) currentReach = hammerMinLength;

  prevHammerTipX = hammerTipX;
  prevHammerTipY = hammerTipY;

  hammerTipX = playerX + Math.cos(hammerAngle) * currentReach;
  hammerTipY = playerY + Math.sin(hammerAngle) * currentReach;

  handleHammerCollisions();
  handlePlayerCollisions();
  handleHammerCollisions();
  handlePlayerCollisions();

  if (playerX < 45 + playerRadius) {
    playerX = 45 + playerRadius;
    playerVx = 0;
  }
  if (playerX > 855 - playerRadius) {
    playerX = 855 - playerRadius;
    playerVx = 0;
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
      if (p.y < -1200) {
        ctx.fillStyle = "#ecf0f1";
      } else {
        ctx.fillStyle = "#27ae60";
      }
      ctx.fillRect(p.x, p.y, p.width, 5);
    }
  }
}

function drawPlayerAndHammer() {
  ctx.strokeStyle = "#a0522d";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(playerX, playerY - 8);
  ctx.lineTo(hammerTipX, hammerTipY);
  ctx.stroke();

  ctx.save();
  ctx.translate(hammerTipX, hammerTipY);
  ctx.rotate(hammerAngle + Math.PI / 2);

  ctx.fillStyle = "#7f8c8d";
  ctx.fillRect(-14, -10, 28, 20);

  ctx.strokeStyle = "#bdc3c7";
  ctx.lineWidth = 2;
  ctx.strokeRect(-14, -10, 28, 20);

  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  ctx.fillStyle = "#2f3640";
  ctx.beginPath();
  ctx.arc(playerX, playerY + 4, playerRadius, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawPlatforms();
  drawPlayerAndHammer();
}

function gameLoop() {
  updatePhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);