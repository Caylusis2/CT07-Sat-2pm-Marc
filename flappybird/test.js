let bird,bg,birdImg;

function preload(){
    bg = loadImage('assets/background-night.png');
}
    
function setup(){
    createCanvas(400,600);
    image(bg,0,0,width,height);
    bird = new Sprite();
    bird.x = 200;
    bird.y = 300;
    bird.width = 20;
    bird.height = 20;
    bird.image = midflapping;
}

