const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;

//criar matriz
var balls = [];
var boats = [];
var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

//variáveis para os navios
var boatAnimation = [];
var boatSpriteData, boatSpritesheet;
function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  //arquivos para o boat
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpritesheet = loadImage("./assets/boat/boat.png");
  //arquivos para brokenBoat
  brokenBoatSpritedata = loadJSON("./assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("./assets/boat/broken_boat.png");
  
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  //função para dizer a unidade de ângulo que vamos usar
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);
  //criar objeto navio
  //boat = new Boat(width - 79, height - 60, 170, 170, -80);
  
  //obtendo os dados dos quadros
  var boatFrames = boatSpriteData.frames;
  for (let i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position; //obtendo a posição de cada quadro de boatFrames
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);//obter a imagem de boatSpritesheet, 
    boatAnimation.push(img);//enviando imagem para a matriz boatAnimation
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  //push();
  //fill("brown");
  //rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  //pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  showBoats();//chamar função para mostrar navios
  //for para percorrer cada elemento da nossa matriz balls
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  //mostrar canhão
  cannon.display();
}

//função para atirar
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length -1].shoot();
    console.log(balls)
  }
}

function keyPressed() {
  if(keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    //adicionar bolas de canhão à matriz
    //Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
    console.log(balls)
  }
}

//função para mostrar bolas de canhão
function showCannonBalls(ball, index) {
  if(ball) {
    //iremos passar ao chamar a function no for
    ball.display();

    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      ball.remove(index);
    }
  }
}

function showBoats() {
  if(boats.length > 0) {//verifica se na matriz boats há algum navio
    //checa se o último elemento dentro da matriz boats é um corpo de navio, e não qualquer corpo indefinido
    if(boats[boats.length - 1] === undefined || 
      boats[boats.length - 1].body.position.x < width -300) {
      var positions = [-40, -60, -70, -20];//posições para o navio aparecer na tela
      var position = random(positions);
      var boat = new Boat(width, height - 100, 170, 170, position, boatAnimation);
      boats.push(boat);//adicionando o navio criando dentro da matriz
    }
    for (let i = 0; i < boats.length; i++) {
      if(boats[i]) {//condicional para verificar se há um navio nesse índice
        Matter.Body.setVelocity(boats[i].body, {//definindo a velocidade do navio
          x: -0.9,
          y: 0
        });
        boats[i].display();
        boats[i].animate();//método que "anima" os navios
      }
      //mostrar navio
     
   } 
  } else {
    var boat = new Boat(width - 79, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);//adicionando o navio criado dentro da matriz
  }
}

//função para checar colisão entre navio e bola de canhão
function collisionWithBoat(index) {
  for (let i = 0; i < boats.length; i++) {
    //checando se o index é indefinido ou não
    if(balls[index] !== undefined && boats[i] !== undefined) {
      //variável para colocar colisão entre ball e boat
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      if (collision.collided) {
        boats[i].remove(i);//removendo navio da array

        Matter.World.remove(world, balls[index].body);//removendo ball do mundo
        delete balls[index]; //deletando ball da array
      }
    }
    
  }
}