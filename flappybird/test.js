let bg;

function preload(){
    bg = loadImage('assets/background-night.png');
}
    
function setup(){
    createCanvas(400,600);
    background(225);
}

function draw(){
    bird = new Sprite();
}