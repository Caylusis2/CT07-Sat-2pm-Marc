let birdImg;

function preload(){
    birdImg = loadImage('assets/redbird-midflap.png');
}
    
function setup(){
    createCanvas(400,600);
    background(220);
    bird = new Sprite(200,300,30,30,"static");
    
    bird.collider = 'dynamic';
    bird.mass = 2;
    bird.drag = 0.02;
    bird.bounciness = 0.05;
    world.gravity.y = 10;
}

function draw(){
    
}