//targeting

function getDistance(ship){
    const dx = ship.x;
    const dy = ship.y;

    return Math.sqrt(dx * dx + dy * dy);
}

function getBearing(ship){
    const angle = Math.atan2(ship.y, ship.x);
    let bearing = (angle * 180 / Math.PI + 360) % 360;
    return bearing.toFixed(0);
}

function updateTargetTracking(){
    if(!lockedTarget) return;

    const dist = getDistance(lockedTarget);
    const bearing = getBearing(lockedTarget);

    const nm = ((dist / RADIUS) * 100).toFixed(1); // convert to nautical miles

    document.getElementById('t-bearing').innerText = bearing + '°';
  document.getElementById('t-range').innerText   = nm + ' NM';
  document.getElementById('t-status').innerText  = 'TRACKING';
}

