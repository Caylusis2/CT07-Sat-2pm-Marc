// ======================================================
// TOXIC ARENA - Free For All Shooter
// p5.js + p5play v3
// Save as: mygame/sketch.js
// ======================================================

let player;
let enemies = [];
let bullets = [];
let particles = [];

let gameState = "menu";
let gameStartTime = 0;
let gameDuration = 60;
let elapsed = 0;

let kills = 0;
let totalEnemies = 9;

let arena = {
  w: 1500,
  h: 1100,
  smokeRadius: 850,
  minRadius: 80
};

let aimMode = false;
let joystick = { x: 0, y: 0 };
let joystickActive = false;
let firing = false;

let aimButton = { x: 0, y: 0, r: 36 };
let shootButton = { x: 0, y: 0, r: 42 };

let pointer = { x: 0, y: 0 };
let pointerDown = false;

const COLORS = [
  "#ff595e", "#ffca3a", "#8ac926",
  "#1982c4", "#6a4c93", "#f15bb5",
  "#00bbf9", "#fb8500", "#43aa8b"
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("Trebuchet MS");
  angleMode(RADIANS);

  // Disable gravity for top-down gameplay
  world.gravity.y = 0;

  updateButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButtons();
}

function updateButtons() {
  aimButton.x = width - 145;
  aimButton.y = height - 105;

  shootButton.x = width - 65;
  shootButton.y = height - 105;
}

function createFighter(x, y, color, isPlayer = false) {
  // p5play Sprite used as the fighter's game object.
  let body = new Sprite(x, y, 32, 32);
  body.collider = "none";
  body.visible = false;

  return {
    body,
    x,
    y,
    color,
    health: 100,
    maxHealth: 100,
    speed: isPlayer ? 3.7 : random(2.0, 2.8),
    angle: 0,
    alive: true,
    isPlayer,
    cooldown: 0,
    kills: 0,
    name: isPlayer ? "YOU" : "BOT " + floor(random(100, 999)),
    strafe: random([-1, 1])
  };
}

function startGame() {
  enemies = [];
  bullets = [];
  particles = [];
  kills = 0;
  elapsed = 0;
  aimMode = false;

  player = createFighter(
    arena.w / 2,
    arena.h / 2,
    "#35d9ff",
    true
  );

  for (let i = 0; i < totalEnemies; i++) {
    let angle = TWO_PI * i / totalEnemies;

    let x = arena.w / 2 + cos(angle) * random(300, 550);
    let y = arena.h / 2 + sin(angle) * random(250, 400);

    enemies.push(
      createFighter(x, y, COLORS[i % COLORS.length])
    );
  }

  gameStartTime = millis();
  gameState = "playing";
}

function draw() {
  background("#182b32");

  if (gameState === "menu") {
    drawMenu();
    return;
  }

  if (gameState === "gameover") {
    drawGameOver();
    return;
  }

  elapsed = (millis() - gameStartTime) / 1000;

  updateGame();

  // Camera follows player
  let camX = constrain(player.x, width / 2, arena.w - width / 2);
  let camY = constrain(player.y, height / 2, arena.h - height / 2);

  push();

  translate(
    width / 2 - camX,
    height / 2 - camY
  );

  drawArena();
  drawSmoke();
  drawBullets();
  drawFighters();
  drawParticles();

  pop();

  drawHUD();
  drawControls();

  if (!player.alive) {
    gameState = "gameover";
  }

  if (enemies.filter(e => e.alive).length === 0) {
    gameState = "gameover";
  }
}

// ======================================================
// ARENA
// ======================================================

function drawArena() {
  noStroke();
  fill("#263f37");
  rect(0, 0, arena.w, arena.h);

  // Ground tiles
  for (let x = 0; x < arena.w; x += 80) {
    for (let y = 0; y < arena.h; y += 80) {
      fill((x / 80 + y / 80) % 2 === 0
        ? "#315448"
        : "#29483f");

      rect(x, y, 78, 78, 5);
    }
  }

  // Arena boundary
  noFill();
  stroke("#d7e8c5");
  strokeWeight(9);
  rect(0, 0, arena.w, arena.h, 12);

  // Obstacles
  randomSeed(45);

  for (let i = 0; i < 45; i++) {
    let x = random(80, arena.w - 100);
    let y = random(80, arena.h - 100);

    // Keep center relatively clear
    if (dist(x, y, arena.w / 2, arena.h / 2) < 100) {
      continue;
    }

    noStroke();
    fill("#172d29");
    rect(x + 5, y + 7, 65, 55, 9);

    fill("#8b6644");
    rect(x, y, 65, 55, 9);

    fill("#a77a4e");
    rect(x + 5, y + 5, 55, 10, 5);

    fill("#65462f");
    rect(x + 10, y + 35, 45, 12, 4);
  }

  randomSeed();
}

// ======================================================
// SMOKE
// ======================================================

function drawSmoke() {
  if (elapsed < gameDuration) return;

  let smokeTime = elapsed - gameDuration;

  arena.smokeRadius = max(
    arena.minRadius,
    850 - smokeTime * 15
  );

  let centerX = arena.w / 2;
  let centerY = arena.h / 2;

  noStroke();

  // Toxic zone outside safe circle
  fill(115, 25, 80, 100);

  beginShape();
  vertex(0, 0);
  vertex(arena.w, 0);
  vertex(arena.w, arena.h);
  vertex(0, arena.h);

  beginContour();

  for (let i = 0; i <= 100; i++) {
    let a = -TWO_PI * i / 100;
    vertex(
      centerX + cos(a) * arena.smokeRadius,
      centerY + sin(a) * arena.smokeRadius
    );
  }

  endContour();
  endShape(CLOSE);

  noFill();
  stroke("#d65cff");
  strokeWeight(5);
  circle(centerX, centerY, arena.smokeRadius * 2);

  // Damage players outside safe zone
  if (dist(player.x, player.y, centerX, centerY) >
      arena.smokeRadius) {
    player.health -= 0.12;
  }

  for (let e of enemies) {
    if (
      e.alive &&
      dist(e.x, e.y, centerX, centerY) >
      arena.smokeRadius
    ) {
      e.health -= 0.15;

      if (e.health <= 0) {
        eliminate(e);
      }
    }
  }
}

// ======================================================
// GAME UPDATE
// ======================================================

function updateGame() {
  if (!player.alive) return;

  // Player movement
  let dx = joystick.x;
  let dy = joystick.y;

  if (keyIsDown(87) || keyIsDown(UP_ARROW)) dy -= 1;
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) dy += 1;
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) dx -= 1;
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) dx += 1;

  let movement = createVector(dx, dy);

  if (movement.mag() > 1) movement.normalize();

  player.x += movement.x * player.speed;
  player.y += movement.y * player.speed;

  player.x = constrain(player.x, 25, arena.w - 25);
  player.y = constrain(player.y, 25, arena.h - 25);

  player.body.x = player.x;
  player.body.y = player.y;

  // Find nearest target
  let target = getNearestEnemy(player);

  if (aimMode && target) {
    player.angle = atan2(
      target.y - player.y,
      target.x - player.x
    );
  }

  if (keyIsDown(32)) shoot(player);

  // Enemy AI
  for (let e of enemies) {
    if (!e.alive) continue;

    updateEnemy(e);
  }

  // Update bullets
  for (let b of bullets) {
    if (!b.alive) continue;

    b.x += b.vx;
    b.y += b.vy;
    b.life--;

    if (
      b.x < 0 || b.y < 0 ||
      b.x > arena.w || b.y > arena.h ||
      b.life <= 0
    ) {
      b.alive = false;
      continue;
    }

    let targets = b.owner === player
      ? enemies
      : [player];

    for (let target of targets) {
      if (!target.alive) continue;

      if (
        dist(b.x, b.y, target.x, target.y) <
        20
      ) {
        target.health -= b.damage;
        b.alive = false;

        createHitParticles(b.x, b.y);

        if (target.health <= 0) {
          eliminate(target);

          if (b.owner === player) {
            kills++;
            player.kills++;
          } else if (b.owner.alive) {
            b.owner.kills++;
          }
        }

        break;
      }
    }
  }

  bullets = bullets.filter(b => b.alive);

  if (player.health <= 0) {
    player.alive = false;
  }

  updateParticles();
}

// ======================================================
// ENEMY AI
// ======================================================

function updateEnemy(e) {
  let target = player;
  let bestDist = dist(e.x, e.y, player.x, player.y);

  // Target nearest other living fighter
  for (let other of enemies) {
    if (other === e || !other.alive) continue;

    let d = dist(e.x, e.y, other.x, other.y);

    if (d < bestDist) {
      bestDist = d;
      target = other;
    }
  }

  if (!target.alive) return;

  let a = atan2(target.y - e.y, target.x - e.x);
  let d = dist(e.x, e.y, target.x, target.y);

  e.angle = a;

  if (d > 190) {
    e.x += cos(a) * e.speed;
    e.y += sin(a) * e.speed;
  } else {
    e.x += cos(a + HALF_PI) * e.strafe * e.speed;
    e.y += sin(a + HALF_PI) * e.strafe * e.speed;
  }

  e.x = constrain(e.x, 25, arena.w - 25);
  e.y = constrain(e.y, 25, arena.h - 25);

  e.body.x = e.x;
  e.body.y = e.y;

  if (d < 440 && random() < 0.035) {
    shoot(e);
  }
}

// ======================================================
// SHOOTING
// ======================================================

function shoot(fighter) {
  if (!fighter.alive || fighter.cooldown > 0) return;

  let a = fighter.angle;

  if (fighter === player && !aimMode) {
    // Face pointer direction when not auto-aiming
    let camX = constrain(player.x, width / 2, arena.w - width / 2);
    let camY = constrain(player.y, height / 2, arena.h - height / 2);

    let worldPointerX = pointer.x - width / 2 + camX;
    let worldPointerY = pointer.y - height / 2 + camY;

    if (pointer.x !== 0 || pointer.y !== 0) {
      a = atan2(
        worldPointerY - player.y,
        worldPointerX - player.x
      );
    }
  }

  fighter.angle = a;

  bullets.push({
    x: fighter.x + cos(a) * 23,
    y: fighter.y + sin(a) * 23,
    vx: cos(a) * 10,
    vy: sin(a) * 10,
    owner: fighter,
    damage: 25,
    life: 65,
    alive: true
  });

  fighter.cooldown = fighter === player ? 16 : 45;
}

function eliminate(fighter) {
  if (!fighter.alive) return;

  fighter.alive = false;

  for (let i = 0; i < 15; i++) {
    createHitParticles(fighter.x, fighter.y);
  }

  if (fighter === player) {
    player.health = 0;
  }
}

// ======================================================
// RENDERING
// ======================================================

function drawFighters() {
  drawFighter(player);

  for (let e of enemies) {
    if (e.alive) drawFighter(e);
  }
}

function drawFighter(f) {
  push();
  translate(f.x, f.y);

  // Shadow
  noStroke();
  fill(0, 0, 0, 65);
  ellipse(4, 14, 39, 16);

  // Character body
  fill(f.color);
  stroke("#18232a");
  strokeWeight(3);
  ellipse(0, 0, 37, 37);

  // Face
  noStroke();
  fill("#ffffff");
  ellipse(7, -5, 9, 11);
  ellipse(-7, -5, 9, 11);

  fill("#18232a");
  ellipse(8, -4, 4, 5);
  ellipse(-6, -4, 4, 5);

  // Direction / weapon
  rotate(f.angle);
  fill("#303943");
  rect(9, -5, 24, 10, 4);
  fill("#d4e3e7");
  rect(23, -3, 13, 6, 2);

  pop();

  // Health bar
  let barWidth = 43;

  noStroke();
  fill("#252525");
  rect(f.x - barWidth / 2, f.y - 30, barWidth, 6, 3);

  fill("#65f071");
  rect(
    f.x - barWidth / 2,
    f.y - 30,
    barWidth * max(0, f.health) / f.maxHealth,
    6,
    3
  );

  if (!f.isPlayer) {
    fill("#ffffff");
    textAlign(CENTER);
    textSize(10);
    text(f.name, f.x, f.y - 37);
  }
}

function drawBullets() {
  for (let b of bullets) {
    fill("#ffdb4a");
    stroke("#fff2ae");
    strokeWeight(2);
    circle(b.x, b.y, 10);
  }
}

function createHitParticles(x, y) {
  particles.push({
    x,
    y,
    vx: random(-3, 3),
    vy: random(-3, 3),
    life: 25,
    color: random(["#ffffff", "#ffe66d", "#ff6b6b"])
  });
}

function updateParticles() {
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  }

  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  noStroke();

  for (let p of particles) {
    fill(p.color);
    circle(p.x, p.y, p.life / 3);
  }
}

// ======================================================
// HUD
// ======================================================

function drawHUD() {
  // Top panel
  noStroke();
  fill(10, 20, 30, 220);
  rect(15, 15, 220, 92, 15);

  fill("#ffffff");
  textAlign(LEFT);
  textSize(16);
  textStyle(BOLD);
  text("TOXIC ARENA", 28, 40);

  textStyle(NORMAL);
  textSize(13);
  text("ELIMINATIONS: " + kills, 28, 63);

  fill("#ff6b6b");
  text("HP: " + max(0, ceil(player.health)), 28, 84);

  // Countdown
  let remaining = max(0, ceil(gameDuration - elapsed));

  fill(10, 20, 30, 220);
  rect(width / 2 - 90, 15, 180, 48, 12);

  textAlign(CENTER);
  textSize(17);

  if (elapsed < gameDuration) {
    fill("#ffffff");
    text("SMOKE IN " + remaining + "s", width / 2, 45);
  } else {
    fill("#ff65a3");
    text("TOXIC ZONE!", width / 2, 45);
  }

  // Enemy counter
  fill(10, 20, 30, 220);
  rect(width - 145, 15, 130, 48, 12);

  fill("#ffffff");
  textSize(15);
  text(
    "ALIVE: " +
    (enemies.filter(e => e.alive).length + (player.alive ? 1 : 0)),
    width - 80,
    45
  );

  // Health bar
  fill("#18232a");
  rect(15, 120, 180, 13, 6);

  fill("#65e879");
  rect(
    15,
    120,
    180 * max(0, player.health) / 100,
    13,
    6
  );
}

// ======================================================
// MOBILE CONTROLS
// ======================================================

function drawControls() {
  // Movement joystick
  let baseX = 95;
  let baseY = height - 110;

  noStroke();
  fill(255, 255, 255, 45);
  circle(baseX, baseY, 115);

  fill(255, 255, 255, 80);
  circle(
    baseX + joystick.x * 35,
    baseY + joystick.y * 35,
    47
  );

  fill("#ffffff");
  textAlign(CENTER);
  textSize(11);
  text("MOVE", baseX, baseY + 72);

  // Aim button
  fill(aimMode ? "#00d9ff" : "#637987");
  stroke("#ffffff");
  strokeWeight(2);
  circle(aimButton.x, aimButton.y, aimButton.r * 2);

  noStroke();
  fill("#ffffff");
  textSize(12);
  text("AIM", aimButton.x, aimButton.y + 4);

  // Shoot button
  fill(firing ? "#ff6b35" : "#e84c4c");
  stroke("#ffffff");
  strokeWeight(2);
  circle(shootButton.x, shootButton.y, shootButton.r * 2);

  noStroke();
  fill("#ffffff");
  textSize(12);
  text("SHOOT", shootButton.x, shootButton.y + 4);
}

// ======================================================
// INPUT
// ======================================================

function getNearestEnemy(fighter) {
  let nearest = null;
  let best = Infinity;

  for (let e of enemies) {
    if (!e.alive) continue;

    let d = dist(fighter.x, fighter.y, e.x, e.y);

    if (d < best) {
      best = d;
      nearest = e;
    }
  }

  return nearest;
}

function pointerPosition() {
  if (touches.length > 0) {
    return {
      x: touches[0].x,
      y: touches[0].y
    };
  }

  return { x: mouseX, y: mouseY };
}

function handlePointerDown() {
  let p = pointerPosition();

  pointer.x = p.x;
  pointer.y = p.y;

  if (gameState === "menu") {
    startGame();
    return false;
  }

  if (gameState === "gameover") {
    startGame();
    return false;
  }

  // Aim toggle
  if (
    dist(p.x, p.y, aimButton.x, aimButton.y) <
    aimButton.r + 15
  ) {
    aimMode = !aimMode;
    return false;
  }

  // Shooting button
  if (
    dist(p.x, p.y, shootButton.x, shootButton.y) <
    shootButton.r + 15
  ) {
    firing = true;
    return false;
  }

  // Joystick
  if (p.x < width * 0.4 && p.y > height * 0.55) {
    joystickActive = true;
    updateJoystick(p);
  }

  return false;
}

function updateJoystick(p) {
  let baseX = 95;
  let baseY = height - 110;

  let dx = p.x - baseX;
  let dy = p.y - baseY;

  let v = createVector(dx, dy);

  if (v.mag() > 40) v.setMag(40);

  joystick.x = v.x / 40;
  joystick.y = v.y / 40;
}

function handlePointerMove() {
  let p = pointerPosition();

  pointer.x = p.x;
  pointer.y = p.y;

  if (joystickActive) {
    updateJoystick(p);
  }
}

function handlePointerUp() {
  joystickActive = false;
  joystick.x = 0;
  joystick.y = 0;
  firing = false;
}

function mousePressed() {
  return handlePointerDown();
}

function mouseReleased() {
  handlePointerUp();
}

function mouseMoved() {
  handlePointerMove();
}

function mouseDragged() {
  handlePointerMove();
  return false;
}

function touchStarted() {
  return handlePointerDown();
}

function touchMoved() {
  handlePointerMove();
  return false;
}

function touchEnded() {
  handlePointerUp();
  return false;
}

function keyPressed() {
  if (key === "e" || key === "E") {
    aimMode = !aimMode;
  }

  if (key === " ") {
    firing = true;
  }

  if (key === "r" || key === "R") {
    if (gameState === "gameover") startGame();
  }
}

function keyReleased() {
  if (key === " ") firing = false;
}

// ======================================================
// MENUS
// ======================================================

function drawMenu() {
  background("#172d35");

  // Decorative background
  noStroke();

  for (let i = 0; i < 20; i++) {
    fill(40, 100, 95, 40);
    circle(
      (i * 173) % width,
      (i * 239) % height,
      100
    );
  }

  textAlign(CENTER);

  fill("#ffffff");
  textStyle(BOLD);
  textSize(min(width * 0.12, 65));
  text("TOXIC ARENA", width / 2, height * 0.30);

  fill("#49e0b0");
  textSize(18);
  text("FREE FOR ALL", width / 2, height * 0.30 + 40);

  fill("#ffffff");
  textStyle(NORMAL);
  textSize(15);

  text(
    "ELIMINATE EVERYONE. SURVIVE THE TOXIC SMOKE.",
    width / 2,
    height * 0.47
  );

  fill("#ffb347");
  rectMode(CENTER);
  rect(width / 2, height * 0.62, 210, 58, 14);
  rectMode(CORNER);

  fill("#18232a");
  textStyle(BOLD);
  textSize(21);
  text("PLAY NOW", width / 2, height * 0.62 + 7);

  fill("#bdced4");
  textStyle(NORMAL);
  textSize(12);
  text(
    "WASD / ARROWS TO MOVE  •  E TO AIM  •  SPACE TO SHOOT",
    width / 2,
    height * 0.77
  );

  text("Mobile: use the on-screen controls", width / 2, height * 0.82);
}

function drawGameOver() {
  background("#14242b");

  textAlign(CENTER);

  fill("#ffffff");
  textStyle(BOLD);
  textSize(45);

  let won = player.alive;

  text(
    won ? "VICTORY!" : "ELIMINATED!",
    width / 2,
    height * 0.30
  );

  fill("#ffc857");
  textSize(22);
  text("ELIMINATIONS: " + kills, width / 2, height * 0.43);

  fill("#ffffff");
  textSize(17);
  text(
    "SURVIVAL TIME: " + floor(elapsed) + "s",
    width / 2,
    height * 0.50
  );

  fill("#ffb347");
  rectMode(CENTER);
  rect(width / 2, height * 0.68, 220, 60, 14);
  rectMode(CORNER);

  fill("#17232b");
  textStyle(BOLD);
  textSize(19);
  text("PLAY AGAIN", width / 2, height * 0.68 + 7);

  textStyle(NORMAL);
}
