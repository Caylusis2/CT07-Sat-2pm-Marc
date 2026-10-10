let bg;

function preload(){
    bg = loadImage('assets/background-night.png');
}
    
function setup(){
    createCanvas(400,600);
    image(bg,0,0,width,height);
}

function draw(){
    bird = new Sprite();
}