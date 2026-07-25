let bird, floor;

let midflaping, bg, base;

function preload(){
    midflaping = loadImage('redbird-midflap.png');
    bg = loadImage('background-night.png');
    base  = loadImage('base.png');
}

function setup(){
    createCanvas(400,600);
    background(225);
}

function draw()