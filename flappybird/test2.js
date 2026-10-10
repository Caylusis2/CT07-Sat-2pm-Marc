let birdImg,bg;

function preload(){
    birdImg = loadImage('assets/redbird-midflap.png');
    bg = loadImage('assets/background-night.png');
}
    
function setup(){
    createCanvas(400,600);
}

function setup(){
    createCanvas(400,600);
    background(225);
    bird = new Sprite(200,300,30,30,"static");
    bird.image = birdImg;
}