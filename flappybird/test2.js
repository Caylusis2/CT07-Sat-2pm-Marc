let ss;

function setup(){
    new Canvas(400,600);
    ss = new Sprite(200,300,40,40);
    world.gravity.y = 10;
}

function draw(){
    background(220);
    if(mouse.presses()){
        ss.velocity.y = -5;
    }
}