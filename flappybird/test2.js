let birdImg;

function preload(){
    birdImg = loadImage('assets/redbird-midflap.png');
}
    
function setup(){
    createCanvas(400,600);
    ss = new Sprite(200,300,40,40);
    bird.collider = 'static';
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.05;
    world.gravity.y = 10;
}

function draw(){
    background(220);
}