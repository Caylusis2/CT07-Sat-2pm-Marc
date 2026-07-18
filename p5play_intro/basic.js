function setup() {
  // write your codes here
  new Canvas (800,400);
  background(220);
  textsize(16);
  // --- Exercise: Area of Triangle ---
  // write your codes here
  // area = 0.5 * base * height
  // console.log("The area of the triangle is :",area);
  // text("The area of the triangle is :" + area,300,200);

  // --- Exercise: Sum of first 10 even numbers ---
  // write your codes here
  // for(let i=0; i<5 ;i++){ }
  // let sum =0;
  // for(let i=0;i<=20;++i){
  //   if(i%2==0){
  //     sum += i;
  //   }
  // }
  // console.log("Sum of first ten even numbers",sum);
  // text("Sum of first ten numbers is: "+sum,300,225);

  // --- Exercise: Age category classification ---
  // write your codes here
  // let age = 10;
  // if(age<=9){
  // console.log("Lower Primary");
  // }else if(age <= 12){
  //   console.log("Upper Primary");
  // }else{
  //   console.log("Secondary");
  // }

  // --- Exercise: Display odd numbers backward using while loop ---
  // write your codes here
  let count = 19;
  while(count >=1){
    console.log(count);
    count -=2;
  }
  
  // --- Exercise: Array operations (groceries) ---
  // write your codes here
  let groceries = ["apple","bread","milk"];
  console.log(groceries);
  groceries.push("orange")
  groceries.push("butter");
  groceries.shift();
  groceries.splice(1,1,"kaya");
  console.log(groceries);
  for(let i=0;i<groceries.length;i++){
    console.log(groceries[i]);
    text(groceries[i], 50 + i*50,350);
  }
}

function draw(){

}

