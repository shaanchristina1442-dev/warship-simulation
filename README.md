## NavRadar — Warship Weapons Simulation
## A real-time naval combat simulation built with vanilla JavaScript and HTML5 Canvas. Features a military CRT-style radar interface, live ship tracking, weapons systems, and enemy AI.
## Demo
## Open index.html in any browser — no build tools, no dependencies, no server required.
## Features

-- Live Radar Sweep — Rotating 360° sweep with range rings and crosshairs
-- Enemy Fleet — hostile warships from Russia, China, Iran, and North Korea with randomized positions and movement
-- Friendly Fleet — allied warships that can take damage and be destroyed
-- Target Lock — Click any blip on the radar to lock on and view ship details
-- Weapons Systems — Four operational weapons with individual ammo tracking

-- MK-45 Naval Cannon (120 rounds)
-- Tomahawk BGM-109 Cruise Missile (8 missiles)
-- Phalanx CIWS (offline)
-- RIM-66 SM-2 Surface-to-Air Missile (24 missiles)


-- Enemy AI — Hostile ships dodge incoming fire, deploy countermeasures, and attack your vessel and allies
-- Hull Damage System — US Destroyer takes damage from enemy fire; hull bar turns yellow then red as integrity drops
-- Live Combat Log — All events logged in real time with timestamps
-- Dynamic Target Panel — Live bearing, range, speed, and nation data for locked targets

## Tech Stack

-- Vanilla JavaScript (ES6)
-- HTML5 Canvas API
-- CSS3 (Grid, Flexbox, custom properties, animations)
-- No frameworks, no libraries, no build tools

## Project Structure
## warship-simulation/
-- ├── index.html
-- ├── style.css
-- └── js/
--    ├── ship.js           # Ship data, movement, enemy attack AI
--    ├── weapons.js        # Weapons logic, ammo tracking, destroy/dodge/countermeasures
--    ├── target.js         # Target tracking, bearing and range calculations
--    ├── countermeasures.js
--    ├── radar.js          # Canvas rendering, sweep animation, ship dots, explosions
--    └── main.js           # Game loop, HUD updates, win/loss conditions
## How to Play

-- Open index.html in your browser
-- Watch the radar for red blips — those are enemy ships
-- Click a red blip to lock on
-- Check the Target Lock panel for ship name, type, nation, bearing, and range
-- Select a weapon and hit FIRE or LAUNCH
-- Enemies may dodge, deploy countermeasures, or get destroyed
-- Watch the combat log — enemies will fire back and damage your hull
-- Destroy all hostile contacts to win
## How to Run
-- open with live server

Ship Difficulty
TypeDodge ChanceCountermeasuresSubmarine40-45%4Destroyer30-35%2Cruiser20-25%3Frigate10-15%1Corvette20%1
Author
Shaan Patel — @shaanchristina1442-dev
Computer Science, New York Institute of Technology
