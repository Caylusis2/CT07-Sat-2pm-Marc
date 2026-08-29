let dojoBG;
let fruitGroup;
let fruitTypes = [];

function preload(){
    dojoBG =loadImage('assets/dojobackground.png');
}
let peach = {
    whole: loadImage('assets/peachwhole.png')
};

let watermelon = {
    whole: loadImage('assets/watermelonwhole.png')
}

function setup(){
    new Canvas(800,600);
    world.gravity.y = 10;
}

function draw(){
    clear();
    image(dojoBG, 0, 0, width, height);
}