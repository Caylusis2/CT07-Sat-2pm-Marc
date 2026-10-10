let bird,bg,birdImg;

function preload(){
    birdImg = loadImage('assets/redbird-midflap.png');
    bg = loadImage("")
}
    
function setup(){
    createCanvas(400,600);
    bird = new Sprite(200,300,30,30,"static");
    bird.image = birdImg;
}
function draw(){
    image(bg,0,0,width,height);
}