//radar
const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');

const airCanvas = document.getElementById('airRadarCanvas');
const airCtx = airCanvas.getContext('2d');

const CX = canvas.width / 2;
const CY = canvas.height / 2;
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
function drawAircraftRadar() {
  enemyAircraft.forEach(plane => {
    airCtx.beginPath();
    airCtx.arc(CX + plane.x, CY + plane.y, 3, 0, Math.PI * 2);
    airCtx.fillStyle = '#ff8800';
    airCtx.shadowBlur = 8;
    airCtx.shadowColor = '#ff8800';
    airCtx.fill();
  });
}

function drawAirSweep() {
  airCtx.save();
  airCtx.translate(CX, CY);
  airCtx.rotate(angle);
  airCtx.beginPath();
  airCtx.moveTo(0, 0);
  airCtx.arc(0, 0, RADIUS, -0.4, 0);
  airCtx.fillStyle = 'rgba(255, 136, 0, 0.06)';
  airCtx.fill();
  airCtx.beginPath();
  airCtx.moveTo(0, 0);
  airCtx.lineTo(RADIUS, 0);
  airCtx.strokeStyle = '#ff8800';
  airCtx.lineWidth = 2;
  airCtx.shadowBlur = 10;
  airCtx.shadowColor = '#ff8800';
  airCtx.stroke();
  airCtx.restore();
}

function drawAirGrid() {
  airCtx.strokeStyle = '#2a1500';
  airCtx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    airCtx.beginPath();
    airCtx.arc(CX, CY, (RADIUS / 4) * i, 0, Math.PI * 2);
    airCtx.stroke();
  }
  airCtx.beginPath();
  airCtx.moveTo(CX, CY - RADIUS);
  airCtx.lineTo(CX, CY + RADIUS);
  airCtx.moveTo(CX - RADIUS, CY);
  airCtx.lineTo(CX + RADIUS, CY);
  airCtx.stroke();
}

function update(){
    // ── Surface radar ──
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000500';
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    drawGrid();
    drawSweep();
    drawShips();
    drawEnemyMissiles();
    drawExplosions();

    // ── Air radar ──
    airCtx.clearRect(0, 0, airCanvas.width, airCanvas.height);
    airCtx.fillStyle = '#000500';
    airCtx.beginPath();
    airCtx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    airCtx.fill();
    drawAirGrid();
    drawAirSweep();
    drawAircraftRadar();

    angle += 0.02;
    if (angle > Math.PI * 2) angle = 0;
    moveShips();
    moveMissiles();
    moveAircraft();
    moveEnemyMissiles();
    updateTargetTracking();
    drawMissiles();
    requestAnimationFrame(update);
}
//locking target

canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseX = (e.clientX - rect.left) * scaleX - CX;
  const mouseY = (e.clientY - rect.top) * scaleY - CY;

  enemyWarships.forEach(ship => {
    const dx = ship.x - mouseX;
    const dy = ship.y - mouseY;
    if (Math.hypot(dx, dy) < 10) {
      lockedTarget = ship;
      lockedTarget.faction = 'HOSTILE';
    }
  });
  friendlyWarships.forEach(ship => {
    const dx = ship.x - mouseX;
    const dy = ship.y - mouseY;
    if (Math.hypot(dx, dy) < 10) {
      lockedTarget = ship;
      lockedTarget.faction = 'FRIENDLY';
    }
  });

  if (lockedTarget) updateTargetPanel(lockedTarget);
});

airCanvas.addEventListener('click', function(e) {
  const rect = airCanvas.getBoundingClientRect();
  const scaleX = airCanvas.width / rect.width;
  const scaleY = airCanvas.height / rect.height;
  const mouseX = (e.clientX - rect.left) * scaleX - CX;
  const mouseY = (e.clientY - rect.top) * scaleY - CY;

  enemyAircraft.forEach(plane => {
    const dx = plane.x - mouseX;
    const dy = plane.y - mouseY;
    if (Math.hypot(dx, dy) < 10) {
      lockedTarget = plane;
      lockedTarget.faction = 'AIRCRAFT';
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
  if (ship.faction === 'HOSTILE')        desig.className = 'target-val target-val--hostile';
  else if (ship.faction === 'AIRCRAFT')  desig.className = 'target-val target-val--aircraft';
  else                                   desig.className = 'target-val';
}
let enemyMissiles = [];

function spawnEnemyMissile(attacker) {
  const dx = -attacker.x;
  const dy = -attacker.y;
  const dist = Math.hypot(dx, dy) || 1;
  const speed = 1.5;
  enemyMissiles.push({
    x: attacker.x,
    y: attacker.y,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
  });
  showMissileWarning();
}

function moveEnemyMissiles() {
  enemyMissiles = enemyMissiles.filter(m => {
    m.x += m.vx;
    m.y += m.vy;
    return Math.hypot(m.x, m.y) > 6;
  });
  if (enemyMissiles.length === 0) hideMissileWarning();
}

function drawEnemyMissiles() {
  enemyMissiles.forEach(m => {
    ctx.beginPath();
    ctx.arc(CX + m.x, CY + m.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffff00';
    ctx.fill();
  });
}

let explosions = [];

function fireWeaponEffect(ship) {
  explosions.push({
    x: ship.x,
    y: ship.y,
    radius: 2,
    alpha: 1
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

function drawMissiles() {
  incomingMissiles.forEach(missile => {
    ctx.save();
    ctx.translate(CX + missile.x, CY + missile.y);
    ctx.rotate(missile.heading);
    
    //arrow shape
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-4, -4);
    ctx.lineTo(-4, 4);
    ctx.closePath();
    ctx.fillStyle = '#ff2a2a';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff2a2a';
    ctx.fill();

    ctx.restore();
  });
}

update();
