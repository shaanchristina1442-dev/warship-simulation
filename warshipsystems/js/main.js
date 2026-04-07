//main js

let gameTime = 0;

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return h + ':' + m + ':' + s;
}

function updateHUD(){
    document.getElementById('contactCount').innerText = enemyWarships.length + friendlyWarships.length;
    const deg = ((angle * 180 / Math.PI) % 360).toFixed(0);
    document.getElementById('sweepAngle').innerText = deg + '°';
    updateContactList();
    updateStatusPane();
}

function updateContactList() {
    const list = document.getElementById('contactList');
    list.innerHTML = '';
    enemyWarships.forEach(function(ship) {
        const row = document.createElement('div');
        row.className = 'contact-row contact-row--hostile';
        row.innerHTML = '<span class="contact-name">' + ship.name + '</span>' +
                        '<span class="contact-type">' + ship.type + '</span>' +
                        '<span class="contact-nation">' + ship.nation + '</span>' +
                        '<span class="contact-hdg">' + ship.heading + '°</span>';
        list.appendChild(row);
    });
    friendlyWarships.forEach(function(ship) {
        const row = document.createElement('div');
        row.className = 'contact-row contact-row--friendly';
        row.innerHTML = '<span class="contact-name">' + ship.name + '</span>' +
                        '<span class="contact-type">' + ship.type + '</span>' +
                        '<span class="contact-nation">' + ship.nation + '</span>' +
                        '<span class="contact-hdg">' + ship.heading + '°</span>';
        list.appendChild(row);
    });
}

function updateStatusPane() {
    document.getElementById('st-cannon').innerText   = cannonRounds   + ' / 120 RDS';
    document.getElementById('st-tomahawk').innerText = tomahawkCount  + ' / 8 MSL';
    document.getElementById('st-sm2').innerText      = sm2Count       + ' / 24 MSL';
}

function switchTab(name) {
    document.querySelectorAll('.log-pane').forEach(function(p) { p.classList.add('log-pane--hidden'); });
    document.querySelectorAll('.log-tab').forEach(function(b)  { b.classList.remove('log-tab--active'); });
    document.getElementById('pane-' + name).classList.remove('log-pane--hidden');
    document.getElementById('tab-'  + name).classList.add('log-tab--active');
}
// Run HUD update every second
const gameInterval = setInterval(function() {
    gameTime++;
    updateHUD();

    //check win condition
    if(enemyWarships.length === 0){
        addLog('All hostile vessels destroyed. Mission accomplished!', 'alert');
        clearInterval(gameInterval);
    }
}, 1000);
