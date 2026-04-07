//weapons
// weapons.js

let cannonRounds   = 120;
let tomahawkCount  = 8;
let sm2Count       = 24;

function fireWeapon(weaponName) {
  if (!lockedTarget) {
    addLog('No target locked. Weapons hold.', 'warn');
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

function destroyTarget(weaponName) {
  const name = lockedTarget.name;
  fireWeaponEffect(lockedTarget);

  const index = enemyWarships.findIndex(ship => ship == lockedTarget);
  if (index !== -1){
    enemyWarships.splice(index, 1);
  }
  lockedTarget = null;

  document.getElementById('t-designation').innerText = '--';
  document.getElementById('t-class').innerText = '--';
  document.getElementById('t-type').innerText = '--';
  document.getElementById('t-nation').innerText = '--';
  document.getElementById('t-bearing').innerText = '--';
  document.getElementById('t-range').innerText = '-- NM';
  document.getElementById('t-speed').innerText = '-- KTS';
  document.getElementById('t-status').innerText = 'DESTROYED';

  addLog(weaponName + ' fired on ' + name + ' -- TARGET DESTROYED.', 'alert');

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