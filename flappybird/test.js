let bg;

function preload(){
    bg = loadImage('assets/background-night.png');
}
    
function setup(){
    createCanvas(400,600);
    background();
}

function draw(){
    bird = new Sprite();
}