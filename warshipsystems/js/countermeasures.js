// countermeasures.js

const cmCooldowns = {
  CHAFF:  false,
  FLARE:  false,
  DECOY:  false,
  ECM:    false,
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
    cmCooldowns[type] = false;
    addLog(type + ' recharged and ready.', '');
    if (btn) {
      btn.classList.remove('cm-btn--active');
      btn.disabled = false;
    }
  }, cmDurations[type]);
}
