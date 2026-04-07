// ship.js

const enemyWarships = [
  { name: 'Dmitri Petlov',   type: 'Destroyer',  nation: 'Russian Federation', heading: 213, speed: 22, dodge: 0.3, countermeasures: 2 },
  { name: 'Lanchang',        type: 'Cruiser',     nation: 'China',              heading: 145, speed: 18, dodge: 0.2, countermeasures: 3 },
  { name: 'Dena',            type: 'Frigate',     nation: 'Iran',               heading: 310, speed: 15, dodge: 0.15, countermeasures: 1 },
  { name: 'Pyongyang',       type: 'Frigate',     nation: 'North Korea',        heading: 78,  speed: 14, dodge: 0.1, countermeasures: 1 },
  { name: 'Shanghai',        type: 'Cruiser',     nation: 'China',              heading: 190, speed: 20, dodge: 0.25, countermeasures: 3 },
  { name: 'Yvsletya',        type: 'Submarine',   nation: 'Russian Federation', heading: 55,  speed: 10, dodge: 0.4, countermeasures: 4 },
  { name: 'Hochan',          type: 'Destroyer',   nation: 'China',              heading: 270, speed: 19, dodge: 0.3, countermeasures: 2 },
  { name: 'Mortaran',        type: 'Corvette',    nation: 'Iran',               heading: 330, speed: 16, dodge: 0.2, countermeasures: 1 },
  { name: 'Anna Scherkbova', type: 'Submarine',   nation: 'Russian Federation', heading: 120, speed: 12, dodge: 0.45, countermeasures: 4 },
  { name: 'Mayoung',         type: 'Destroyer',   nation: 'China',              heading: 95,  speed: 21, dodge: 0.35, countermeasures: 2 },
];

const friendlyWarships = [
  { name: 'HMS Princess Belle', type: 'Destroyer',        nation: 'United Kingdom', heading: 247, speed: 18 },
  { name: 'FS Sharon B',        type: 'Destroyer',        nation: 'France',         heading: 260, speed: 17 },
  { name: 'USS Laboon',         type: 'Destroyer',        nation: 'United States',  heading: 255, speed: 18 },
  { name: 'INS Chennai',        type: 'Destroyer',        nation: 'India',          heading: 240, speed: 16 },
  { name: 'USS Nimitz',         type: 'Aircraft Carrier', nation: 'United States',  heading: 250, speed: 14 },
  { name: 'USS New York',       type: 'Submarine',        nation: 'United States',  heading: 230, speed: 11 },
];

const ownShip = {
  name: 'USS Christina Sosa',
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
  //each enemy ship has a small chance to attack each second
  enemyWarships.forEach(ship => {
    const roll = Math.random();
    if (roll < 0.20) return; // 20% chance to attack
    
    //pick a random target - user or friendly warship
    const targets = ['USER SHIP', ...friendlyWarships];
    const target = targets[Math.floor(Math.random() * targets.length)];

    if (target === 'USER SHIP'){
      const dodgeRoll = Math.random();

      if (dodgeRoll < ownShip.dodge) {
        addLog(ship.name + 'fired on ' + ownShip.name + '-- DEPLOY COUNTERMEASURES, ATTACK EVADED.', 'warn');
        return;
      }
      //pause
    }

  })
}



