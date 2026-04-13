// ship.js

let hullIntegrity = 100;

const enemyWarships = [
  { name: 'Dmitri Petlov',   type: 'Destroyer',  nation: 'Russian Federation', heading: 213, speed: 22, dodge: 0.3, countermeasures: 5 },
  { name: 'Lanchang',        type: 'Cruiser',     nation: 'China',              heading: 145, speed: 18, dodge: 0.2, countermeasures: 8 },
  { name: 'Dena',            type: 'Frigate',     nation: 'Iran',               heading: 310, speed: 15, dodge: 0.15, countermeasures: 3 },
  { name: 'Pyongyang',       type: 'Frigate',     nation: 'North Korea',        heading: 78,  speed: 14, dodge: 0.1, countermeasures: 3 },
  { name: 'Shanghai',        type: 'Cruiser',     nation:'China',              heading: 190, speed: 20, dodge: 0.25, countermeasures: 8 },
  { name: 'Yvsletya',        type: 'Submarine',   nation: 'Russian Federation', heading: 55,  speed: 10, dodge: 0.4, countermeasures: 15 },
  { name: 'Hochan',          type: 'Destroyer',   nation: 'China',              heading: 270, speed: 19, dodge: 0.3, countermeasures: 5 },
  { name: 'Mortaran',        type: 'Corvette',    nation: 'Iran',               heading: 330, speed: 16, dodge: 0.2, countermeasures: 2 },
  { name: 'Anna Scherkbova', type: 'Submarine',   nation: 'Russian Federation', heading: 120, speed: 12, dodge: 0.45, countermeasures: 15 },
  { name: 'Mayoung',         type: 'Destroyer',   nation: 'China',              heading: 95,  speed: 21, dodge: 0.35, countermeasures: 5 },
];

const friendlyWarships = [
  { name: 'HMS Princess Belle', type: 'Destroyer',        nation: 'United Kingdom', heading: 247, speed: 18, dodge: 0.3, countermeasures: 5 },
  { name: 'FS Sharon B',        type: 'Destroyer',        nation: 'France',         heading: 260, speed: 17, dodge: 0.2, countermeasures: 5 },
  { name: 'USS Laboon',         type: 'Destroyer',        nation: 'United States',  heading: 255, speed: 18, dodge: 0.3, countermeasures: 5 },
  { name: 'INS Chennai',        type: 'Destroyer',        nation: 'India',          heading: 240, speed: 16, dodge: 0.25, countermeasures: 5 },
  { name: 'USS Nimitz',         type: 'Aircraft Carrier', nation: 'United States',  heading: 250, speed: 14, dodge: 0.1, countermeasures: 10 },
  { name: 'USS New York',       type: 'Submarine',        nation: 'United States',  heading: 230, speed: 11, dodge: 0.4, countermeasures: 15 },
];

const ownShip = {
  name: 'USS Lily Collins',
  type: 'Destroyer',
  nation: 'United States',
  heading: 247,
  speed: 18,
  x: 0,
  y: 0,
};

const RADAR_RADIUS = 210;

function randomPos(){
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * RADAR_RADIUS;
    return{
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,

    };
}
enemyWarships.forEach(ship => {
    const pos = randomPos();
    ship.x = pos.x;
    ship.y = pos.y;
});

friendlyWarships.forEach(ship => {
    const pos = randomPos();
    ship.x = pos.x;
    ship.y = pos.y;
});

function moveShips() {
  enemyWarships.forEach(ship => {
    const rad = (ship.heading * Math.PI) / 180;
    ship.x += Math.cos(rad) * (ship.speed * 0.01);
    ship.y += Math.sin(rad) * (ship.speed * 0.01);

    //bounce off radar edge
    const dist = Math.sqrt(ship.x * ship.x + ship.y * ship.y);
    if (dist > RADAR_RADIUS){
      ship.heading = (ship.heading + 180) % 360;
    }
  });
  friendlyWarships.forEach(ship => {
    const rad = (ship.heading * Math.PI) / 180;
    ship.x += Math.cos(rad) * (ship.speed * 0.01);
    ship.y += Math.sin(rad) * (ship.speed * 0.01);

    //bounce off radar edge
    const dist = Math.sqrt(ship.x * ship.x + ship.y * ship.y);
    if (dist > RADAR_RADIUS){
      ship.heading = (ship.heading + 180) % 360;
    }
  });

}
function enemyAttack() {
  enemyWarships.forEach(ship => {

    // Each enemy has a random chance to fire each second
    const roll = Math.random();
    if (roll > 0.50) return; // 70% chance to attack per tick

    // Pick a random target — own ship or a friendly
    const targets = ['OWN SHIP', ...friendlyWarships.map(f => f.name)];
    const target  = targets[Math.floor(Math.random() * targets.length)];

    if (target === 'OWN SHIP') {
      // countermeasure roll — active CMs raise dodge chance
      const activeCMs = Object.values(cmCooldowns).filter(Boolean).length;
      const dodgeChance = 0.25 + (activeCMs * 0.15);
      const dodgeRoll = Math.random();
      if (dodgeRoll < dodgeChance) {
        addLog(ship.name + ' fired on USS LILY COLLINS — COUNTERMEASURES DEPLOYED.', 'warn');
        return;
      }

      // Hit — reduce hull integrity
      hullIntegrity -= Math.floor(Math.random() * 10) + 5;
      if (hullIntegrity < 0) hullIntegrity = 0;
      updateHullDisplay();
      addLog(ship.name + ' HIT USS LILY COLLINS. Hull integrity: ' + hullIntegrity + '%.', 'alert');

      if (hullIntegrity <= 0) {
        addLog('USS LILY COLLINS DESTROYED. MISSION FAILED.', 'alert');
      }

    } else {
      // Attack a friendly ship
      const friendly = friendlyWarships.find(f => f.name === target);
      if (!friendly) return;

      const dodgeRoll = Math.random();
      if (dodgeRoll < 0.3) {
        addLog(ship.name + ' fired on ' + target + ' — EVADED.', 'warn');
        return;
      }

      // Remove friendly ship
      const index = friendlyWarships.indexOf(friendly);
      if (index !== -1) friendlyWarships.splice(index, 1);
      addLog(ship.name + ' DESTROYED ' + target + '.', 'alert');
    }
  });
}

function friendlyAttack() {
  friendlyWarships.forEach(ship => {
    const roll = Math.random();
    if (roll > 0.40) return; // 40% chance to attack per tick

    // Target a random enemy warship or aircraft
    const targets = [...enemyWarships, ...enemyAircraft];
    if (targets.length === 0) return;
    const target = targets[Math.floor(Math.random() * targets.length)];

    // Target attempts to evade
    const dodge = target.dodge || 0;
    if (Math.random() < dodge) {
      addLog(ship.name + ' fired on ' + target.name + ' — EVADED.', 'warn');
      return;
    }

    // Target deploys countermeasures against missiles
    if (target.countermeasures > 0 && Math.random() < dodge) {
      target.countermeasures--;
      addLog(ship.name + ' fired on ' + target.name + ' — COUNTERMEASURES DEPLOYED. CM remaining: ' + target.countermeasures + '.', 'warn');
      return;
    }

    // Hit — remove target from correct array
    const shipIndex = enemyWarships.indexOf(target);
    if (shipIndex !== -1) {
      enemyWarships.splice(shipIndex, 1);
      addLog(ship.name + ' DESTROYED ' + target.name + '.', 'alert');
      return;
    }
    const aircraftIndex = enemyAircraft.indexOf(target);
    if (aircraftIndex !== -1) {
      enemyAircraft.splice(aircraftIndex, 1);
      addLog(ship.name + ' splashed ' + target.name + '.', 'alert');
    }
  });
}

function updateHullDisplay() {
    const bar = document.querySelector('.stat-fill');
    const val = document.querySelector('.stat-value');
    bar.style.width = hullIntegrity + '%';
    val.innerText = hullIntegrity + '%';

    if (hullIntegrity > 60) {
      bar.style.background = 'var(--green)';
    }
    else if (hullIntegrity > 30){
      bar.style.background = 'var(--yellow)';
    }
    else {
      bar.style.background = 'var(--red)';
    } 
}







