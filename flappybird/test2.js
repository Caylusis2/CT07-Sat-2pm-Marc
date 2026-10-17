// let ss;

// function setup(){
//     new Canvas(400,600);
//     ss = new Sprite(200,300,40,40);
//     world.gravity.y = 10;
// }

// function draw(){
//     background(220);
//     if(mouse.presses()){
//         ss.velocity.y = -5;
//     }
// }

let favoriteFoods = ["Pizza", "Burger", "Sushi"];
let pos;

function setup(){
    createCanvas(400, 200);
    pos = 50;
    textSize(24);
}

function draw(){
    background(220);
    for (let i = 0; i < favoriteFoods.length; i++){
        text(favoriteFoods[i], pos + i * 100, height/2);
    }
}