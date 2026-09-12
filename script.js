const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hammerSound = new Audio("sounds/hammer-hit.mp3");
const winSound = new Audio("sounds/win.mp3");
winSound.volume = 0.6;

const backbtnn = document.querySelector("#backBtn");
backBtn.addEventListener("click", () => {
  homeOverlay.classList.remove("hidden");
  bgMusic.pause(); 
});

const bgMusic = new Audio("sounds/bgMusic.mp3")
bgMusic.volume = 0.3;
bgMusic.loop = true;
bgMusic.play();

let isMuted = false;

function mute() {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  hammerSound.muted = isMuted;
  winSound.muted = isMuted;

  if (isMuted) {
    muteBtn.textContent = "Unmute (M)";
    muteBtn.classList.add("btn-muted-state");
  } else {
    muteBtn.textContent = "Mute (M)";
    muteBtn.classList.remove("btn-muted-state");
  }
}

muteBtn.addEventListener("click", mute);
document.addEventListener("keydown", (e)=>{
  // console.log(e.key);
  if(e.key === "M" || e.key === "m"){
    mute();
  }
})

window.addEventListener("click", () => {
  hammerSound.play().then(() => {
    hammerSound.pause();
    hammerSound.currentTime = 0;
  }).catch(() => { });
}, { once: true });

let lastHammerSoundTime = 0;

const altitudeText = document.getElementById("altitudeText");
const progressText = document.getElementById("progressText");
const restartBtn = document.getElementById("restartBtn");
const motivationalText = document.getElementById("motivationalText");
const winOverlay = document.getElementById("winOverlay");
const playAgainBtn = document.getElementById("playAgainBtn");
const winTimeText = document.getElementById("winTime");
const quoteOverlay = document.getElementById("quoteOverlay");
const quoteText = document.getElementById("quoteText");
const homeOverlay = document.getElementById("homeOverlay");
const playBtn = document.getElementById("playBtn");

let gravity = 0.2;
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

let hammerMaxLength = 95;
const hammerMinLength = 35;
const hammerHeadRadius = 14;

let hammerAngle = -Math.PI / 2;
let hammerTipX = playerX;
let hammerTipY = playerY - hammerMaxLength;
let prevHammerTipX = hammerTipX;
let prevHammerTipY = hammerTipY;

const difficultySettings = {
  easy: {
    gravity: 0.1,
    hammerMaxLength: 105
  },
  medium: {
    gravity: 0.35,
    hammerMaxLength: 95
  },
  hard: {
    gravity: 0.55,
    hammerMaxLength: 85
  }
};

let currentDifficulty = "medium";

const diffButtons = document.querySelectorAll(".btn-diff");
diffButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentDifficulty = btn.dataset.level;
    applyDifficulty(currentDifficulty);
  });
});

const quotesList = [
  "He conquers who continues.",
  "No wall is higher than the resolve to climb it.",
];

function applyDifficulty(level) {
  const config = difficultySettings[level];
  gravity = config.gravity;
  hammerMaxLength = config.hammerMaxLength;
}
applyDifficulty("medium");

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
  gameWon = false;
  startTime = Date.now();
  fallCount = 0;
  highestAltitudeReached = 0;
  lastPlayerY = playerY;
  winOverlay.classList.add("hidden");
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => { });
}

playBtn.addEventListener("click", () => {
  homeOverlay.classList.add("hidden");

  const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
  quoteText.textContent = `"${randomQuote}"`;
  
  quoteOverlay.classList.remove("hidden", "fade-out"); 
  
  setTimeout(() => {
    quoteOverlay.classList.add("fade-out");
    
      setTimeout(() => {
      quoteOverlay.classList.add("hidden"); 
      resetPlayer(); 
      bgMusic.play().catch((err) =>{});
    }, 2000); 
    
  }, 3000);
});

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();
  mouseScreenX = event.clientX - rect.left;
  mouseScreenY = event.clientY - rect.top;
});

window.addEventListener("keydown", function (event) {
  if (event.key === "r" || event.key === "R") {
    resetPlayer();
  }
});

restartBtn.addEventListener("click", resetPlayer);
playAgainBtn.addEventListener("click", resetPlayer);

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
      const rightDist = rect.x + rect.width - circleX;
      const topDist = circleY - rect.y;
      const bottomDist = rect.y + rect.height - circleY;
      const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);

      if (minDist === topDist) { nx = 0; ny = -1; overlap = topDist + radius; }
      else if (minDist === bottomDist) { nx = 0; ny = 1; overlap = bottomDist + radius; }
      else if (minDist === leftDist) { nx = -1; ny = 0; overlap = leftDist + radius; }
      else { nx = 1; ny = 0; overlap = rightDist + radius; }
    }

    return { colliding: true, nx, ny, overlap, contactX: closestX, contactY: closestY };
  }

  return { colliding: false };
}

function handlePlayerCollisions() {
  isGrounded = false;

  for (let i = 0; i < platforms.length; i++) {
    const hit = checkCircleRectCollision(playerX, playerY, playerRadius, platforms[i]);

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
      const tangentX = -hit.ny;
    }

  }
}

function handleHammerCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    const hit = checkCircleRectCollision(hammerTipX, hammerTipY, hammerHeadRadius, platforms[i]);

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

      const swingSpeed = Math.abs(hammerTipX - prevHammerTipX) + Math.abs(hammerTipY - prevHammerTipY);

      const tangentX = -hit.ny;
      const tangentY = hit.nx;

      const tipMoveX = hammerTipX - prevHammerTipX;
      const tipMoveY = hammerTipY - prevHammerTipY;

      const tangentialSwing = tipMoveX * tangentX + tipMoveY * tangentY;

      playerVx -= tangentX * tangentialSwing * 0.28;
      playerVy -= tangentY * tangentialSwing * 0.28;

      if (swingSpeed > 3 && Math.random() < 0.3) {
        createDustParticle(hit.contactX, hit.contactY);
      }

      if (swingSpeed > 3) {
        const now = Date.now();

        if (now - lastHammerSoundTime > 120) {
          const minSpeed = 2;
          const maxSpeed = 25;
          const clampedSpeed = Math.min(maxSpeed, Math.max(swingSpeed, minSpeed));
          const t = (clampedSpeed - minSpeed) / (maxSpeed - minSpeed);
          hammerSound.volume = 0.2 + t * 0.8;
          hammerSound.playbackRate = 0.8 + t * 0.4;
          hammerSound.currentTime = 0;
          hammerSound.play().catch(() => { });
          lastHammerSoundTime = now;
        }
      }
    }
  }
}

function createDustParticle(x, y) {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.8) * 3,
      size: Math.random() * 3 + 2,
      alpha: 1,
      color: "#bdc3c7"
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.04;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function updatePhysics() {
  if (gameWon) return;

  playerVy += gravity;

  playerVx *= friction;
  playerVy *= friction;

  if (isGrounded) {
    playerVx *= groundFriction;
  }

  playerX += playerVx;
  playerY += playerVy;

  const mouseWorldX = mouseScreenX;
  const mouseWorldY = mouseScreenY + cameraY;
  const dx = mouseWorldX - playerX;
  const dy = mouseWorldY - playerY;

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


  if (playerX < 50 + playerRadius) {
    playerX = 50 + playerRadius;
    playerVx = 0;
  }
  if (playerX > 850 - playerRadius) {
    playerX = 850 - playerRadius;
    playerVx = 0;
  }

  const targetCameraY = playerY - 390;
  cameraY += (targetCameraY - cameraY) * 0.1;
  updateParticles();
  updateGameInfo();
  checkWinCondition();
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

class AuroraWave {
  constructor(baseY, amplitude, frequency, speed, colorStops) {
    this.baseY = baseY;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.speed = speed;
    this.colorStops = colorStops;
    this.timeOffset = Math.random() * 100;
  }

  update() {
    this.timeOffset += this.speed;
  }

  draw() {
    ctx.save();

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.95;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);


    for (let x = 0; x <= canvas.width; x += 10) {

      const y = this.baseY +
        Math.sin(x * this.frequency + this.timeOffset) * this.amplitude +
        Math.cos(x * 0.005 - this.timeOffset) * (this.amplitude * 0.3);

      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, this.baseY - this.amplitude * 1.5, 0, canvas.height);
    gradient.addColorStop(0, this.colorStops[0]);
    gradient.addColorStop(0.4, this.colorStops[1]);
    gradient.addColorStop(0.8, this.colorStops[2]);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();

    const waveY = this.baseY +
      Math.sin(mouseScreenX * this.frequency + this.timeOffset) * this.amplitude +
      Math.cos(mouseScreenX * 0.005 - this.timeOffset) * (this.amplitude * 0.3);
    const distance = Math.abs(mouseScreenY - waveY);

    const glow = Math.max(0, 1 - distance / 100);

    if (glow > 0) {
      const glowGradient = ctx.createRadialGradient(mouseScreenX, waveY, 0, mouseScreenX, waveY, 150);
      glowGradient.addColorStop(0, this.colorStops[0]);
      glowGradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = glow * 0.8;
      ctx.beginPath();
      ctx.arc(mouseScreenX, waveY, 150, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.restore();
  }
}


const auroraLayers = [
  new AuroraWave(canvas.height * 0.25, 70, 0.003, 0.008, ['rgba(0, 255, 150, 1)', 'rgba(0, 190, 255, 0.8)', 'rgba(150, 0, 255, 0)']),
  new AuroraWave(canvas.height * 0.35, 30, 0.003, 0.005, ['rgba(0, 220, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'rgba(120, 0, 255, 0.7)', 'rgba(50, 0, 100, 0)']),
  new AuroraWave(canvas.height * 0.55, 100, 0.0015, 0.002, ['rgba(180, 0, 255, 0.9)', 'rgba(0, 255, 200, 0.6)', 'rgba(0, 0, 0, 0)'])
];

function drawSummitFlag() {
  const poleX = 500;
  const poleY = summitY;

  ctx.strokeStyle = "#f5f6fa";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(poleX, poleY);
  ctx.lineTo(poleX, poleY - 70);
  ctx.stroke();

  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.moveTo(poleX, poleY - 70);
  ctx.lineTo(poleX + 45, poleY - 55);
  ctx.lineTo(poleX, poleY - 40);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e67e22";
  ctx.beginPath();
  ctx.arc(poleX, poleY - 72, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f1c40f";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SUMMIT PEAK", poleX, poleY - 85);
}

function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.restore();
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
  ctx.strokeStyle = "#718093";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(playerX, playerY + 4, playerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(playerX - playerRadius - 4, playerY, 4, 8);
  ctx.strokeRect(playerX + playerRadius, playerY, 4, 8);

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(playerX, playerY - 6, 13, Math.PI, 0, false);
  ctx.fill();
  ctx.fillStyle = "#f5cd79";
  ctx.beginPath();
  ctx.arc(playerX, playerY - 20, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#303952";
  ctx.beginPath();
  ctx.arc(playerX, playerY - 22, 10, Math.PI, 0, false);
  ctx.fill();

  const eyeLookX = Math.cos(hammerAngle) * 3;
  const eyeLookY = Math.sin(hammerAngle) * 2;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(playerX - 3, playerY - 20, 3, 0, Math.PI * 2);
  ctx.arc(playerX + 3, playerY - 20, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f3542";
  ctx.beginPath();
  ctx.arc(playerX - 3 + eyeLookX, playerY - 20 + eyeLookY, 1.5, 0, Math.PI * 2);
  ctx.arc(playerX + 3 + eyeLookX, playerY - 20 + eyeLookY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f5cd79";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(playerX, playerY - 8);
  const handX = playerX + Math.cos(hammerAngle) * 18;
  const handY = playerY - 8 + Math.sin(hammerAngle) * 18;
  ctx.lineTo(handX, handY);
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  auroraLayers.forEach(layer => {
    layer.update();
    layer.draw();
  });
  ctx.save();
  ctx.translate(0, -cameraY);
  drawPlatforms();
  drawSummitFlag();
  drawParticles();
  drawPlayerAndHammer();
  ctx.restore();
}

function updateGameInfo() {
  const totalClimbDistance = 470 - summitY;
  const currentClimb = Math.max(0, 470 - playerY);
  const meters = Math.round(currentClimb / 28);
  altitudeText.textContent = meters + " m";

  const percentage = Math.min(100, Math.round(currentClimb / totalClimbDistance * 100));
  progressText.textContent = percentage + "%";

  if (meters > highestAltitudeReached) {
    highestAltitudeReached = meters;
  }
}

function checkWinCondition() {
  if (playerY <= summitY + 20 && !gameWon) {
    gameWon = true;
    winSound.currentTime = 0;
    winSound.play().catch(() => { });
    bgMusic.pause();
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    winTimeText.textContent = elapsedSeconds + "s";
    winOverlay.classList.remove("hidden");

  }
}

function gameLoop() {
  updatePhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);