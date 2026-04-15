// countermeasures.js
let incomingMissiles = [];

function detectIncomingMissile(missile) {
    incomingMissiles.push({
    x: attacker.x,
    y: attacker.y,
    heading: Math.atan2(-attacker.y, -attacker.x),
    speed: 6,
    attacker: attacker.name,
    timeLeft: 10,
});
addLog('INCOMING MISSILE DETECTED: ' + attacker.name, 'DEPLOY COUNTERMEASURES', 'alert');
}


function moveMissiles() {
  incomingMissiles.forEach(missile => {
    missile.x += Math.cos(missile.heading) * missile.speed;
    missile.y += Math.sin(missile.heading) * missile.speed;
    missile.timeleft -= 2;
  });
  incomingMissiles = incomingMissiles.filter(m => {
    const dist = Math.hypot(missile.x, missile.y);
    if (dist < 12) {
      missileImpact(missile);
      return false;
    }
    return true;
  });
}

function missileImpact(missile) {
  const damage = Math.floor(Math.random() * 15) + 10; // Random damage between 10-25%
  let hullIntegrity = damage;
  if (hullIntegrity < 0) hullIntegrity = 0;
  updateHullDisplay();
  addLog(missile.attacker + ' HIT USS LILY COLLINS with a missile. Hull integrity: ' + hullIntegrity + '%.', 'alert');

  if (hullIntegrity <= 0) {
    addLog('USS LILY COLLINS has been sunk. Mission failed.', 'alert');
    clearInterval(gameInterval);
  }
}

function deployChaff() {
  if(incomingMissiles.length === 0) {
    addLog('No incoming missiles detected.', 'alert');
    return;
  }

  // 50% chance to successfully divert each missile
  const roll = Math.random();
  if (roll < 0.5) {
    incomingMissiles = [];
    addLog('CHAFF deployed successfully. Incoming missiles diverted.', 'alert');
    hideMissileWarning();
  }
  else {
    addLog('CHAFF deployed but failed to divert all missiles.', 'alert');
  }
}

function deployFlare() {
  if(incomingMissiles.length === 0) {
    addLog('No incoming missiles detected.', 'alert');
    return;
  }
  //flares work on aircraft missiles only
  const roll = Math.random();
  if (roll < 0.5) {
    incomingMissiles = [];
    addLog('FLARE deployed successfully. Incoming missiles diverted.', 'alert');
    hideMissileWarning();
  }
  else{
    addLog('FLARE deployed but failed to divert all missiles.', 'alert');
  }
}

function deployDecoy() {
  if(incomingMissiles.length === 0) {
    addLog('No incoming missiles detected.', 'alert');
    return;
  }
  //decoys work on ships and submarines torpedoes
  const roll = Math.random();
  if(roll < 0.5) {
    incomingMissiles = [];
    addLog('DECOY deployed successfully. Incoming missiles diverted.', 'alert');
    hideMissileWarning();
  }
  else {
    addLog('DECOY deployed but failed to divert all missiles.', 'alert');
  }
}

function deployECM() {
  if(incomingMissiles.length === 0) {
    addLog('No incoming missiles detected.', 'alert');
    return;
  }
  //ECM works on all types of missiles but infared hackers can break through
  const roll = Math.random();
  if(roll < 0.5) {
    incomingMissiles = [];
    addLog('ECM deployed successfully. Incoming missiles diverted.', 'alert');
    hideMissileWarning();
  }
  else {
    addLog('ECM deployed but failed to divert all missiles.', 'alert');
  }
}

function showMissileWarning() {
  const warning = document.getElementById('missileWarning');
  if (warning) warning.style.display = 'flex';
}

function hideMissileWarning() {
  const warning = document.getElementById('missileWarning');
  if (warning) warning.style.display = 'none';
}



const cmCooldowns = {
  CHAFF: false,
  FLARE: false,
  DECOY: false,
  ECM: false,
};

const cmDurations = {
  CHAFF:  8000,
  FLARE:  8000,
  DECOY:  15000,
  ECM:    20000,
};

function deployCountermeasure(type) {
  if (cmCooldowns[type]) {
    addLog(type + ' — still recharging.', 'warn');
    return;
  }

  cmCooldowns[type] = true;
  addLog(type + ' deployed.', 'alert');

  const btn = [...document.querySelectorAll('.cm-btn')]
    .find(b => b.textContent.trim() === type);

  if (btn) {
    btn.classList.add('cm-btn--active');
    btn.disabled = true;
  }

  setTimeout(function() {
    if (hullIntegrity <= 0) return;
    cmCooldowns[type] = false;
    addLog(type + ' recharged and ready.', '');
    if (btn) {
      btn.classList.remove('cm-btn--active');
      btn.disabled = false;
    }
  }, cmDurations[type]);
}
