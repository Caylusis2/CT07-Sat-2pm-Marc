let birdImg;

function preload(){
    birdImg = loadImage('assets/redbird-midflap.png');
}
    
function setup(){
    createCanvas(400,600);
    ss = new Sprite(200,300,40,40);
    bird.collider = 'static';
    world.gravity.y = 10;
}

function draw(){
    background(220);
    if(mouse.presses()){
        ss.velocity.y = -5;
    }
}