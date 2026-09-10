const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

let mouseScreenX = 450;
let mouseScreenY = 300;

canvas.addEventListener("mousemove", function(event) {
  const rect = canvas.getBoundingClientRect();
r
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

function updatePhysics(){
  if (gameWon) return;
  playerVy+=gravity;
  playerVx*=friction;
  playerVy*=friction;

  if (isGrounded){
    playerVx*=groundFriction;
  }
}

playerX+=playerVx;
playerY+=playerVy;

const mouseWorldX=mouseScreenX;
const mouseWorldY=mouseScreeny+cameraY;

const dx=mouseWorldX-playerX;
const dy=mouseWorldY-playerY;

hammerAngle=Math.atan2(dy/dx);

const mouseDistance= Math.sqrt(dx*dx+dy*dy);

let currentReach=mouseDistance;

if (currentReach>hammerMaxLength){
  currentReach=hammerMaxLength;
}
if (currentReach<hammerMinLength){
  currentReach=hammerMinLength;
}

prevHammerTipX=hammerTipX;
prevHammerTipY=hammerTipY;

hammerTipX=playerX+Math.cos(hammerAngle)*currentReach;
hammerTipY=playerY=Math.sin(hammerAngle)*currentReach;

class Star {
const altitudeText = document.getElementById("altitudeText");
const progressText = document.getElementById("progressText");
const restartBtn = document.getElementById("restartBtn");
const motivationalText = document.getElementById("motivationalText");

// if(restartBtn){
//   resetPlayer();
// }
window.addEventListener("keydown", (e)=>{
  if(e.key = "R"){
  resetPlayer();
  }
  console.log("hello ji");
})

const gravity = 0.35;
const friction = 0.98;
const groundfriction = 0.9;

let playerX = 450;
let playerY = 470;
let playersize = 25;
let playerdx = 0;
let playerdy = 0;
let isgrounded = false;

function resetPlayer() {
  playerX = 450;
  playerY = 470;
  playerdx = 0;
  playerdy = 0;
  isgrounded = false;
}

const hammerMaxLength = 95;
const hammerMinLength = 35;
const hammerHeadRadius = 14;

let hammerAngle = -Math.PI / 2;
let hammerTipX = playerX;
let hammerTipY = playerY - hammerMaxLength;
let prevHammerTipX = hammerTipX;
let prevHammerTipY = hammerTipY;

function updatePhysics(){
  playerdy+=gravity;
  playerdx*=friction;
  playerdy*=friction;

  if(isgrounded){
    playerdx*=groundfriction;
  }

  playerX+=playerdx;
  playerY+=playerdy;

   const dx = mouseX - playerX;
  const dy = mouseY - playerY;

  hammerAngle = Math.atan2(dy, dx);
  const mousedist = Math.sqrt(dx*dx + dy*dy);

  let currentReach = mousedist;
  if (currentReach > hammerMaxLength) currentReach = hammerMaxLength;
  if (currentReach < hammerMinLength) currentReach = hammerMinLength;

  prevHammerTipX = hammerTipX;
  prevHammerTipY = hammerTipY;

  hammerTipX = playerX + Math.cos(hammerAngle) * currentReach;
  hammerTipY = playerY + Math.sin(hammerAngle) * currentReach;


  isgrounded = false;
  if(playerY+playersize>520){
    playerY = 520 - playersize;
    playerdy = 0;
    isgrounded = true;
  }

const gravity = 0.35;
const friction = 0.985;
const groundFriction = 0.92;
let cameraY = 0;  
let gameWon = false;
let startTime = Date.now();
let fallCount = 0;
let highestAltitudeReached = 0;
let lastPlayerY = 0;
  if(playerX < playersize){
    playerX = playersize;
    playerdx = 0;
  }

  if(playerX > 900 - playersize){
    playerX = 900-playersize;
    playerdx = 0;
  }
}

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
}

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


function updatePhysics() {
  playerVy += gravity;
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

function drawinghammer () {

  ctx.strokeStyle = "gray";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(playerX, playerY );
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

 ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(playerX, playerY, playersize, 0, Math.PI*2);
  ctx.fill();
}

function draw (){
  ctx.clearRect(0,0, canvas.width , canvas.height);

  drawinghammer();
}

function update(){
  updatePhysics();
  draw();
  requestAnimationFrame(update);
}


requestAnimationFrame(update);


const plateform  = [{
x:0,
y:520,
width:900,
height:150,
color:"green",
}]

const p = plateform[0];
ctx.fillStyle = "green";
ctx.fillRect(p.x, p.y, p.width, p.height);
ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, p.width, p.height);



    let mouseX = 450;
    let mouseY = 300;

    canvas.addEventListener("mousemove", (event)=>{
      const rect = canvas.getBoundingClientRect();
      console.log("getting mouse coordinated");
      mouseX = event.clientX-rect.left;
      mouseY = event.clientY-rect.top;
    })

    
  



