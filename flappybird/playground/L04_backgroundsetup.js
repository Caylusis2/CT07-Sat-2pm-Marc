let bird, floor;
let pipegroup;

let midflaping, bg, base;
let flapUpImg,flapDownImg

function preload(){
    midflaping = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
    base  = loadImage('assets/base.png');
    flapupImg = loadImage('assets/yellowbird-upflap.png');
    flapDownImg = loadImage('assets/yellowbird-downflap.png')
}

function setup(){
    createCanvas(400,600);
    background(225);
    bird = new Sprite();
    bird.x = 200;
    bird.y = 300;
    bird.width = 20;
    bird.height = 20;
    bird.img = midflaping;
    bird.collider = "dynamic";
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.5;
    world.gravity.y = 10;
    pipeGroup = new Group();


    floor = new Sprite();
    floor.x = 200;
    floor.y = height - 20;
    floor.wdith = 400;
    floor.height = 125;
    floor.collider = "static";
    floor.img = base;

}

function draw(){
    image(bg,0,0,width , height);

    if (kb.presses('space') || mouse.presses())
        bird.vel.y = -5;
        bird.sleeping = false;

    if (bird.vel.y < -1){
        bird.img = flapUpImg;
        bird.rotation = -30;
    }
    else if (bird.vel.y > 1) {
        bird.img = flapDownImg;
        bird.rotation = 30;
    }
    else {
        bird.img = flapMidImg;
        bird.rotation = 0;
    }
    
    fill("blue");
    textSize(14);
    text('vel.y: ' + bird.vel.y.toFixed(2), 10, 20);
    text('isMoving: ' + bird.isMoving, 10, 40);
    text('sleeping: ' + bird.sleeping , 10, 60);

    if (frameCount === 1){
        spawnPipePair();
    }
}