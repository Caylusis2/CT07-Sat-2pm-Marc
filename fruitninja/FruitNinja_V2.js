
let dojoBG;

let fruitGroup;
let fruitHalves;
let fruitTypes = [];

let lives = 3;
let score = 0;
let missedFruits = 0;

let gameState = 'start'; // 'start', 'play', 'gameover'
let gameStartTime = 0;
let gameTimer = 0;
let gameDuration = 60;
let finalFruitScore ;
let finalMissFruit;
let FinalScore;

// NEW: Bonus time gained from slicing time fruits
let timeBonus = 0;

let sliceSound;
let backgroundTrack;

let difficultyNumFruits = 1;
let lastDifficultyIncrease = 0;


function preload() {
  dojoBG = loadImage('assets/dojobackground.png');

  // Peach
  let peach = {
    whole: loadImage('assets/peachwhole.png'),
    half1: loadImage('assets/peachhalf.png')
  };

  // Watermelon
  let watermelon = {
    whole: loadImage('assets/watermelonwhole.png'),
    half1: loadImage('assets/watermelonhalf.png')
  };

  // Time fruit
  let timefruit = {
    whole: loadImage('assets/fruitninja_clock.png'),
    half1: loadImage('assets/fruitninja_clockHalf1.png'),
    half2: loadImage('assets/fruitninja_clockHalf2.png'),
    isTimeFruit: true
  };

  let berry = {
    whole: loadImage('assets/fruitninja_berry.png'),
    half1: loadImage('assets/fruitninja_berry_half1.png'),
    half2: loadImage('assets/fruitninja_berry_half2.png')
  };

  let melon = {
    whole: loadImage('assets/fruitninja_melon.png'),
    half1: loadImage('assets/fruitninja_melon_half1.png'),
    half2: loadImage('assets/fruitninja_melon_half2.png')
  };

  let grape = {
    whole: loadImage('assets/fruitninja_grape.png'),
    half1: loadImage('assets/fruitninja_grape_half1.png'),
    half2: loadImage('assets/fruitninja_grape_half2.png')
  };


  fruitTypes = [peach, watermelon, timefruit, berry, melon, grape];

  // Requires p5.sound
  sliceSound = loadSound('assets/fruit-ninja-combo.mp3');
  backgroundTrack = loadSound('assets/fruit-ninja-bgtrack.mp3');
}


function setup() {
  new Canvas(800, 600);

  world.gravity.y = 10;

  fruitGroup = new Group();
  fruitHalves = new Group();
}


function draw() {
  clear();
  image(dojoBG, 0, 0, width, height);

  // START SCREEN
  if (gameState === 'start') {
    if (kb.presses(' ') || mouse.presses()) {
      startGame();
    } else {
      drawStartScreen();
      return;
    }
  }

  // RESTART AFTER GAME OVER
  if (gameState === 'gameover') {
    if (kb.presses(' ') || mouse.presses()) {
      startGame();
    } else {
      drawGameOverScreen();
      return;
    }
  }

  // UPDATE TIMER
  gameTimer = floor((millis() - gameStartTime) / 1000);

  // END GAME WHEN TIME RUNS OUT
  if (gameTimer >= gameDuration + timeBonus) {
    gameTimer = gameDuration + timeBonus;
    endGame();
    drawGameOverScreen();
    return;
  }

  // PLAY BACKGROUND MUSIC
  if (backgroundTrack && !backgroundTrack.isPlaying()) {
    backgroundTrack.loop();
  }

  // SPAWN FRUITS
  if (frameCount % 120 === 0) {
    for (let i = 0; i < difficultyNumFruits; i++) {
      spawnFruit();
    }
  }

  // INCREASE DIFFICULTY EVERY 15 SECONDS
  if (gameTimer - lastDifficultyIncrease >= 15) {
    difficultyNumFruits++;
    lastDifficultyIncrease = gameTimer;
  }

  // SLICE FRUITS WHILE MOUSE IS PRESSED
  if (mouse.pressing()) {
    let trail = new Sprite(mouse.x, mouse.y, 7);

    trail.collider = 'none';
    trail.color = 'red';
    trail.life = 10;

    sliceFruit();
  }

  // COUNT FRUITS THAT FALL OFF SCREEN
  for (let fruit of fruitGroup) {
    if (fruit.y > height + 50) {
      fruit.remove();
      missedFruits++;
      lives--;
    }
  }

  // GAME OVER WHEN NO LIVES REMAIN
  if (lives <= 0) {
    endGame();
    drawGameOverScreen();
    return;
  }

  // DISPLAY SCORE, MISSED FRUITS, TIMER AND LIVES
  stroke(158, 69, 69);
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);

  text('Score: ' + score, 10, 10);
  text('Missed: ' + missedFruits, 200, 10);

  // DISPLAY REMAINING TIME INCLUDING BONUS
  let timeLeft = max(0, gameDuration + timeBonus - gameTimer);
  text('Time: ' + timeLeft, 400, 10);

  fill('green');
  text('Lives: ' + lives, 570, 10);
}


// START OR RESTART A NEW GAME
function startGame() {
  // Reset game state
  gameState = 'play';

  // Reset score and lives
  score = 0;
  missedFruits = 0;
  lives = 3;

  // RESET TIMER
  gameTimer = 0;
  gameStartTime = millis();
  timeBonus = 0;

  // RESET DIFFICULTY
  difficultyNumFruits = 1;
  lastDifficultyIncrease = 0;

  // REMOVE OLD FRUITS
  fruitGroup.removeAll();
  fruitHalves.removeAll();

  // RESTART BACKGROUND MUSIC
  if (backgroundTrack && !backgroundTrack.isPlaying()) {
    backgroundTrack.loop();
  }
}


// END THE GAME
function endGame() {
  gameState = 'gameover';

  if (backgroundTrack && backgroundTrack.isPlaying()) {
    backgroundTrack.stop();
  }
}


// DRAW START SCREEN
function drawStartScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(48);
  text('Fruit Ninja', width / 2, height / 2 - 40);

  textSize(24);
  text(
    'Press SPACE or Click to Start',
    width / 2,
    height / 2 + 20
  );
}


// DRAW GAME OVER SCREEN
function drawGameOverScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(48);

  text('Game Over!', width / 2, height / 2 - 60);

  fill(255);
  textSize(24);

  text('Score: ' + score, width / 2, height / 2);

  text(
    'Missed Fruits: ' + missedFruits,
    width / 2,
    height / 2 + 40
  );

  text(
    'Press SPACE or Click to Restart',
    width / 2,
    height / 2 + 80
  );
}


// SPAWN A RANDOM FRUIT
function spawnFruit() {
  let fruitData = random(fruitTypes);
  let randomX = random(300, 500);

  let fruit = new fruitGroup.Sprite(
    randomX,
    height + 20,
    40
  );

  fruit.image = fruitData.whole;
  fruit.type = fruitData;

  fruit.vel.y = random(-14, -10);
  fruit.vel.x = random(-2, 2);

  fruit.friction = 0;
}


// CHECK WHETHER A FRUIT IS SLICED
function sliceFruit() {
  for (let fruit of fruitGroup) {
    if (fruit.sliced) {
      continue;
    }

    let d = dist(
      mouse.x,
      mouse.y,
      fruit.x,
      fruit.y
    );

    if (d < (fruit.d / 2) + 5) {
      fruit.sliced = true;

      const fx = fruit.x;
      const fy = fruit.y;
      const fruitData = fruit.type;

      fruit.remove();

      // ADD 2 SECONDS WHEN SLICING A TIME FRUIT
      if (fruitData.isTimeFruit) {
        timeBonus += 5;
      }

      // PLAY SLICING SOUND
      if (sliceSound && !sliceSound.isPlaying()) {
        sliceSound.play();
      }

      // SPLIT THE FRUIT
      splitFruit(fx, fy, fruitData);

      score += 1;

      // Slice only one fruit per frame
      break;
    }
  }
}


// SPLIT A FRUIT INTO TWO HALVES
function splitFruit(x, y, fruitData) {
  // LEFT HALF
  let left = new fruitHalves.Sprite(
    x - 10,
    y,
    40,
    40
  );

  left.image = fruitData.half1;
  left.vel.x = -3;
  left.vel.y = random(-5, -2);
  left.rotationSpeed = -5;
  left.life = 30;

  // RIGHT HALF
  let right = new fruitHalves.Sprite(
    x + 10,
    y,
    40,
    40
  );

  right.image = fruitData.half1;
  right.vel.x = 3;
  right.vel.y = random(-5, -2);
  right.rotationSpeed = 5;
  right.life = 30;
}
