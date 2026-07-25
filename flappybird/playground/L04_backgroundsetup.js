let bird, floor;

let midflaping, bg, base;

function preload(){
    midflaping = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
    base  = loadImage('assets/base.png');
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
    bird.collider = 'dynamic';
    
}

function draw(){
    image(bg,0,0,width , height);
}