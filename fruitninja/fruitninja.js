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
    if (frameCount % 120 === 0){
        spawnFruit();

    }
}

function spawnFruit(){
    let fruitData = random(fruitTypes);
    let randomX = random(300, 500);
    let fruit = new fruitGroup.Sprite(randomX, height+20, 40);
    fruit.image = fruitData.whole;
    fruit.type = fruitData;
    fruit.vel.y = random(-10, -14);
    fruit.vel.x = random(-2, 2);
    fruit.friction = 0;
}