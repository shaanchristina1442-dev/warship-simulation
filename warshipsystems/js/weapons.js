//weapons
// weapons.js

let cannonRounds   = 120;
let tomahawkCount  = 8;
let sm2Count       = 24;
let CWISCount      = 1300;

function fireWeapon(weaponName) {
  if (!lockedTarget) {
    addLog('No target locked. Weapons hold.', 'warn');
    return;
  }

  const isAircraft = lockedTarget.faction === 'AIRCRAFT';

  if (weaponName === 'CIWS PHALANX') {
    if (!isAircraft) {
      addLog('CIWS PHALANX — air targets only.', 'warn');
      return;
    }
    fireCWIS();
    return;
  }

  if (isAircraft) {
    addLog('Surface weapons cannot engage air targets. Use CIWS PHALANX.', 'warn');
    return;
  }

  if (lockedTarget.faction !== 'HOSTILE') {
    addLog('Cannot fire on friendly vessel.', 'warn');
    return;
  }

  if (weaponName === 'MK-45 CANNON')    fireCannon();
  if (weaponName === 'TOMAHAWK BGM-109') fireTomahawk();
  if (weaponName === 'RIM-66 SM-2')     fireSM2();
}

function fireCannon() {
  if (cannonRounds <= 0) {
    addLog('MK-45 CANNON — AMMUNITION DEPLETED.', 'warn');
    return;
  }
  cannonRounds--;
  document.querySelector('.weapon-card--ready .weapon-ammo').innerText = 'ROUNDS: ' + cannonRounds + ' / 120';
  destroyTarget('MK-45 CANNON');
}

function fireTomahawk() {
  if (tomahawkCount <= 0) {
    addLog('TOMAHAWK — MISSILES EMPTY.', 'warn');
    return;
  }
  tomahawkCount--;
  document.querySelector('.weapon-card--armed .weapon-ammo').innerText = 'MISSILES: ' + tomahawkCount + ' / 8';
  destroyTarget('TOMAHAWK BGM-109');
}

function fireSM2() {
  if (sm2Count <= 0) {
    addLog('RIM-66 SM-2 — MAGAZINES EMPTY.', 'warn');
    return;
  }
  sm2Count--;
  // SM-2 is the 4th weapon card
  document.querySelectorAll('.weapon-card')[3].querySelector('.weapon-ammo').innerText = 'MISSILES: ' + sm2Count + ' / 24';
  destroyTarget('RIM-66 SM-2');
}
function fireCWIS() {
  if (CWISCount <= 0) {
    addLog('CIWS — AMMUNITION DEPLETED.', 'warn');
    return;
  }
  CWISCount--;
  // CIWS is the 3rd weapon card
  document.querySelectorAll('.weapon-card')[2].querySelector('.weapon-ammo').innerText = 'ROUNDS: ' + CWISCount + ' / 1300';
  destroyTarget('CIWS PHALANX');

}

function clearTargetPanel(status) {
  document.getElementById('t-designation').innerText = '--';
  document.getElementById('t-class').innerText = '--';
  document.getElementById('t-type').innerText = '--';
  document.getElementById('t-nation').innerText = '--';
  document.getElementById('t-bearing').innerText = '--';
  document.getElementById('t-range').innerText = '-- NM';
  document.getElementById('t-speed').innerText = '-- KTS';
  document.getElementById('t-status').innerText = status;
}

function destroyTarget(weaponName) {
  const target = lockedTarget;
  const name = target.name;
  const dodge = target.dodge || 0;
  const cms   = target.countermeasures || 0;

  // ── Cannon — dodge only, no countermeasures ──
  if (weaponName === 'MK-45 CANNON') {
    if (Math.random() < dodge) {
      lockedTarget = null;
      clearTargetPanel('EVADED');
      addLog(name + ' evaded cannon fire.', 'warn');
      return;
    }
  }

  // ── Anti-ship missiles — countermeasures first, small residual dodge if out ──
  if (weaponName === 'TOMAHAWK BGM-109' || weaponName === 'RIM-66 SM-2') {
    if (cms > 0 && Math.random() < dodge) {
      target.countermeasures--;
      lockedTarget = null;
      clearTargetPanel('EVADED');
      addLog(name + ' deployed countermeasures — ' + weaponName + ' defeated. CM remaining: ' + target.countermeasures + '.', 'warn');
      return;
    }
    if (cms <= 0 && Math.random() < dodge * 0.35) {
      lockedTarget = null;
      clearTargetPanel('EVADED');
      addLog(name + ' hard-maneuvered — ' + weaponName + ' missed.', 'warn');
      return;
    }
  }

  // ── CIWS — aircraft dodge only ──
  if (weaponName === 'CIWS PHALANX') {
    if (Math.random() < dodge) {
      lockedTarget = null;
      clearTargetPanel('EVADED');
      addLog(name + ' broke off — CIWS burst missed.', 'warn');
      return;
    }
  }

  // ── Hit confirmed ──
  fireWeaponEffect(target);

  const shipIndex = enemyWarships.findIndex(ship => ship === target);
  if (shipIndex !== -1) enemyWarships.splice(shipIndex, 1);

  const aircraftIndex = enemyAircraft.findIndex(plane => plane === target);
  if (aircraftIndex !== -1) enemyAircraft.splice(aircraftIndex, 1);

  lockedTarget = null;
  clearTargetPanel('DESTROYED');
  addLog(weaponName + ' fired on ' + name + ' — TARGET DESTROYED.', 'alert');
}
function addLog(message, type) {
  const log = document.getElementById('logEntries');
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (type ? ' log-entry--' + type : '');
  const time = new Date().toISOString().substr(11, 8);
  entry.innerHTML = '<span class="log-time">' + time + '</span> ' + message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}