const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

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

  if(playerX < playersize){
    playerX = playersize;
    playerdx = 0;
  }

  if(playerX > 900 - playersize){
    playerX = 900-playersize;
    playerdx = 0;
  }
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

    
  



