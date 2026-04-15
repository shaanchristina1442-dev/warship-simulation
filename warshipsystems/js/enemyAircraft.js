const enemyAircraft = [
    { name: 'Su-33 Flanker-F',   type: 'Fighter',           nation: 'Russian Federation', heading: 90,  speed: 900,  x: 0, y: 0, dodge: 0.45, countermeasures: 3 },
    { name: 'J-11 Flanker-B',    type: 'Fighter',           nation: 'China',              heading: 270, speed: 900,  x: 0, y: 0, dodge: 0.4, countermeasures: 3 },
    { name: 'F-14 Tomcat',       type: 'Fighter-Bomber',    nation: 'Iran',               heading: 180, speed: 900,  x: 0, y: 0, dodge: 0.35, countermeasures: 2 },
    { name: 'Tu-114 Black-Shark', type: 'Bomber',           nation: 'Russian Federation', heading: 230, speed: 400,  x: 0, y: 0, dodge: 0.15, countermeasures: 2 },
    { name: 'H-16 Dark-Dragon',  type: 'Naval-Bomber',      nation: 'China',              heading: 170, speed: 410,  x: 0, y: 0, dodge: 0.15, countermeasures: 2 },
    { name: 'F4 Phantom 2',      type: 'Fighter-Bomber',    nation: 'Iran',               heading: 67,  speed: 1000, x: 0, y: 0, dodge: 0.35, countermeasures: 2 },
    { name: 'KA-52 Alligator',   type: 'Attack Helicopter', nation: 'Russian Federation', heading: 300, speed: 300,  x: 0, y: 0, dodge: 0.25, countermeasures: 2 },
    { name: 'Z-10 Thunderbolt',  type: 'Attack Helicopter', nation: 'China',              heading: 120, speed: 300,  x: 0, y: 0, dodge: 0.25, countermeasures: 2 },
    { name: 'JF-17 Thunder',     type: 'Multirole Fighter', nation: 'Pakistan',           heading: 210, speed: 900,  x: 0, y: 0, dodge: 0.4, countermeasures: 3 },
]
enemyAircraft.forEach(plane => {
    const pos = randomPos();
    plane.x = pos.x;
    plane.y = pos.y;
});

function moveAircraft() {
    enemyAircraft.forEach(plane => {
        const rad = (plane.heading * Math.PI) /180;
        plane.x += Math.cos(rad) * (plane.speed * 0.001);
        plane.y += Math.sin(rad) * (plane.speed * 0.001);

        //bounce off radar edge
        const dist = Math.hypot(plane.x, plane.y);
        if (dist > RADAR_RADIUS){
            plane.heading = (plane.heading + 180) % 360;
        }   
    });

}

function aircraftAttack() {
    enemyAircraft.forEach(plane => {
        const roll = Math.random();
        if (roll > 0.4) return; // 40% chance to attack per tick

        //targets
        const targets = [ownShip, ...friendlyWarships];
        const target = targets[Math.floor(Math.random() * targets.length)];

        //attack
        if (target === ownShip) {
            let hullIntegrity = 5;
            if (hullIntegrity < 0) hullIntegrity = 0;
            updateHullDisplay();
            addLog(plane.name + ' HIT USS LILY COLLINS: Hull integrity: ' + hullIntegrity + '%.', 'alert');

            if (hullIntegrity <= 0) {
                addLog('USS LILY COLLINS has been sunk. Mission failed.', 'alert');

            }
        }
        else {
            //attack friendly 
            const friendly = friendlyWarships.find(f => f === target);
            if (!friendly) return;

            const hitRoll = Math.random();
            if (hitRoll < 0.5) {
                addLog(plane.name + ' fired on ' + friendly.name + ' - MISSED');
                return;
            }
            //remove friendly from radar
            const index = friendlyWarships.indexOf(target);
            if (index !== -1) {
                friendlyWarships.splice(index, 1);
                addLog(plane.name + ' fired on ' + friendly.name + ' - DESTROYED', 'alert');
            }
        } 
    });
}

