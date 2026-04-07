//radar
const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');


const CX = canvas.width / 2;
const CY = canvas.height /2;
const RADIUS = canvas.width / 2 - 10;

let angle = 0;

function drawGrid() {
    ctx.strokeStyle = '#003a10';
    ctx.lineWidth = 1;
    
    //range rings
    for (let i = 1; i <= 4; i++){
        ctx.beginPath();
        ctx.arc(CX, CY, (RADIUS / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
    }

    //crosshairs
    ctx.beginPath();
    ctx.moveTo(CX, CY - RADIUS);
    ctx.lineTo(CX, CY + RADIUS);
    ctx.moveTo(CX - RADIUS, CY);
    ctx.lineTo(CX + RADIUS, CY);
    ctx.stroke();
}
function drawSweep(){
    //sweep trail (fading green arc)
    const gradient = ctx.createConicalGradient
    ? null: null;

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, RADIUS, -0.4, 0);
    ctx.fillStyle = 'rgba(0, 255, 65, 0.08)';
    ctx.fill();

    //Sweep line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(RADIUS, 0);
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff41';
    ctx.stroke();

    ctx.restore();
          
}
function drawShips() {
  // Enemy ships — red dots
  enemyWarships.forEach(ship => {
    ctx.beginPath();
    ctx.arc(CX + ship.x, CY + ship.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2a2a';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff2a2a';
    ctx.fill();
  });

  // Friendly ships — blue dots
  friendlyWarships.forEach(ship => {
    ctx.beginPath();
    ctx.arc(CX + ship.x, CY + ship.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00e5ff';
    ctx.fill();
  });

  // Own ship — green dot at center
  ctx.beginPath();
  ctx.arc(CX, CY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff41';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff41';
  ctx.fill();
}
function update(){
    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //background
    ctx.fillStyle = '#000500';
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.fill();

    drawGrid();
    drawSweep();
    drawShips();
    drawExplosions();

    angle += 0.02;
    if (angle > Math.PI * 2) angle = 0;
    moveShips();
    updateTargetTracking();
    requestAnimationFrame(update);
}
//locking target
let lockedTarget = null;

canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseX = (e.clientX - rect.left) * scaleX - CX;
  const mouseY = (e.clientY - rect.top) * scaleY - CY;

  console.log('click at:', mouseX, mouseY);
  console.log('ships:', enemyWarships.map(s => ({x: s.x, y: s.y})));

  enemyWarships.forEach(ship => {
    const dx = ship.x - mouseX;
    const dy = ship.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if( dist < 10){
      lockedTarget = ship;
      lockedTarget.faction = 'HOSTILE';
    }
  });
  friendlyWarships.forEach(ship => {
    const dx = ship.x - mouseX;
    const dy = ship.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if( dist < 10){
      lockedTarget = ship;
      lockedTarget.faction = 'FRIENDLY';
    }
  });

  if (lockedTarget) updateTargetPanel(lockedTarget);
});
function updateTargetPanel(ship) {
  document.getElementById('t-designation').innerText = ship.name;
  document.getElementById('t-class').innerText = ship.type;
  document.getElementById('t-type').innerText = ship.faction;
  document.getElementById('t-nation').innerText = ship.nation;
  document.getElementById('t-bearing').innerText = ship.heading + '°';
  document.getElementById('t-range').innerText = '-- NM';
  document.getElementById('t-speed').innerText = ship.speed + ' KTS';
  document.getElementById('t-status').innerText = 'TRACKING';

  const desig = document.getElementById('t-designation');
  desig.className = ship.faction === 'HOSTILE' ? 'target-val target-val--hostile' : 'target-val';
}
let explosions = [];

function fireWeaponEffect(ship) {
  explosions.push({
    x: ship.x,
    y: ship.y,
    radius: 2,
    alpha: 1.0
  });
}

function drawExplosions() {
  explosions = explosions.filter(exp => exp.alpha > 0);

  explosions.forEach(exp => {
    ctx.beginPath();
    ctx.arc(CX + exp.x, CY + exp.y, exp.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 42, 42, ' + exp.alpha + ')';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff2a2a';
    ctx.stroke();

    exp.radius += 1.5;
    exp.alpha  -= 0.03;
  });
}

update();
