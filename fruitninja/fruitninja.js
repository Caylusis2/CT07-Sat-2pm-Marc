let dojoBG;
let fruitGroup;
let fruitTypes = [];

function preload(){
    dojoBG =loadImage('assets/dojobackground.png');
}
let peach = {
    whole: loadImage('assets/peachwhole.png'),
    half1: loadImage(assets/peachhalf.png),
    half2: loadImage(assets/peachhalf.png),
};

let watermelon = {
    whole: loadImage('assets/watermelonwhole.png'),
    half1: loadImage('assets/watermelonhalf.png'),
    half2: loadImage('assets/watermelonhalf.png'),
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
    if (mouse.pressing()){
        trail = new Sprite(mouse.x, mouse.y, 7);
        trail.collider = 'none';
        trail.color = "red";
        trail.life = 10;

        sliceFruit();
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

function sliceFruit() {
    for (let fruit of fruitGroup) {
        if (fruit.sliced){
            continue;
        }

        let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);

        if (d < ((fruit.d / 2) + 5)) {
            fruit.sliced = true;

            fruit.remove();

            break;
        }
    }
}