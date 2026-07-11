let ball;
let box;
function setup() {
  // Set up the canvas
  new Canvas(400, 600);
  background(250); //background color

  // Basic shape testing
  // write your codes here
 fill("skyblue");
  // End Basic shape testing
   circle(35,35,60)
   rect(60,55,100,200)
   // Create a bouncing ball sprite
   // write your codes here
  ball = new Sprite();
  ball.x = 360;
  ball.y = 35;
  ball.diameter = 60;
  ball.color = 'red';

  box = new Sprite();
  box.x = 100;
  box.y = 100
  box.w = 50;
  box.h = 75;
  box.color = 'skyblue';

 
  
}

function draw() {
  // write your codes here

  background(240);
  fill(0);
  textSize(16);
  text("Ball: (" + int(ball.x) + ", " + int(ball.y) + ")", 10, 20);
  text("Mouse: (" + mouseX + ", " + mouseY + ")", 10, 40);
}