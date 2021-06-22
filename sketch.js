const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var balloon,balloonImage1,balloonImage2;
var bird1 , bird1Image ;
var stoneSprite , stoneImg;
var score = 0 , bonus = 0;
var live = 3 ;
var gameState = "start";
var endImg;

function preload(){
  bgImg =loadImage("skyee.png");
  balloonImage1=loadImage("Balloon.png");

  platformImage = loadImage("base.png");
  sling1 = loadImage("sling1.png");
  sling2 = loadImage("sling2.png");
  sling3 = loadImage("sling3.png");
  bird1Image = loadAnimation("bird1.png","bird2.png","bird3.png","bird4.png");
  stoneImg = loadImage("stone.png")   
  bird2Image = loadImage("blueBird.png");
  endImg = loadImage("gameOver.jpg");
}
  

//Function to set initial environment
function setup() {
 
  createCanvas(600,500);
  engine = Engine.create();
  world = engine.world;


  bg = createSprite(850,150);  
  bg.addImage(bgImg);
  bg.scale = 4;
  bg.velocityX = -2;

  balloon=createSprite(150,250,150,150);
  balloon.addAnimation("hotAirBalloon",balloonImage1);
  balloon.scale=0.4;

  stone = new Stone(balloon.x+60,balloon.y+50,10);

  stoneSprite = createSprite(stone.body.position.x,stone.body.position.y,10,10);
  stoneSprite.addImage(stoneImg);
  stoneSprite.scale = 0.03;

  //balloon.debug = true ;
  balloon.setCollider("rectangle",0,-20,300,550);


  sling= new Sling(stone.body,{x:balloon.x+65,y:balloon.y+40})
  bgroup = new Group();

  Engine.run(engine);
}

// function to display UI
function draw() {
  background("#C3E6F5");

  score += Math.round(frameCount/180);
  
  if(gameState==="start"){
  if(bg.x<-1250){
    bg.x = -420
  }

  stoneSprite.x = stone.body.position.x;
  stoneSprite.y = stone.body.position.y;

  sling.pointB.x=balloon.x+65;
  sling.pointB.y=balloon.y+40
   
  if(stoneSprite.isTouching(bgroup)){
    bgroup.destroyEach();
    bonus += 1 ;
  }
  if(bonus%10===0 && bonus>0){
    live +=1 ;

  }
  if(bgroup.isTouching(balloon)){
    live -= 1;
    bgroup.destroyEach();
  }
  if(live<=0){
    gameState = "end";

  }
  if(keyDown("w")){
    balloon.y -= 10 ;
  }
  if(keyDown("s")){
    balloon.y += 10;
  }
  spawnObstacles();

  drawSprites();
  image(platformImage,balloon.x+22,balloon.y+90,80,8);
  image(sling1,balloon.x+60,balloon.y+40,20,50); 
  //stone.display()
  image(sling2,balloon.x+50,balloon.y+40,20,30);
  sling.display();
  }
  else if(gameState==="end"){
    background(endImg);

  }
  textSize(20);
  text("LIFE: "+live,100,50);
  text(" Bonus: "+bonus,450,50);
  text(" Score "+score,250,50);
}

  function spawnObstacles(){
    if(frameCount%150===0){
      bird1 = createSprite(850,Math.round(random(100,400)),50,50);
      bird1.addAnimation("bird",bird1Image);
      bird1.velocityX = -5 ;
      bird1.lifetime =  190;
      bird1.depth=balloon.depth-1;
      bgroup.add(bird1);
    }


  }
function mouseDragged(){
    //if (gameState!=="launched"){
        Matter.Body.setPosition(stone.body, {x: mouseX , y: mouseY});
    //}
}
  
function mouseReleased(){
    sling.fly();
    //gameState = "launched";
}

function keyPressed(){
    if(keyCode === 32){
       //bird.trajectory = [];
       Matter.Body.setPosition(stone.body, {x: balloon.x+65, y: balloon.y+50}); 
       sling.attach(stone.body);
    }
}
  