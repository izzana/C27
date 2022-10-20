class CannonBall {
  constructor(x, y) 
  {
    var options = {
      isStatic: true
    };
    this.r = 30;
    //criando corpo circular
    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("./assets/cannonball.png");
    World.add(world, this.body);
  }

  remove(index) {//método para remover bola de canhão do index
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

    setTimeout(() => {
      Matter.World.remove(world, this.body);
      delete balls[index];
    }, 1000);
  }

  //função para atirar
  shoot() {
    var newAngle = cannon.angle - 28;
    newAngle = newAngle *(3.14/180);
    //definindo a velocidade para a bola de canhão
    var velocity = p5.Vector.fromAngle(newAngle);
    velocity.mult(0.5);
    //mudando o valor para a bola não ficar mais parada
    Matter.Body.setStatic(this.body, false);
    //adicionando velocidade
    Matter.Body.setVelocity(this.body, {
      x: velocity.x *(180/3.14), y: velocity.y * (180/3.14)});
  }

  display() {
    //variável armazenará a posição x,y do corpo da bala de canhão.
    var pos = this.body.position;
    push();
    imageMode(CENTER);
    image(this.image, pos.x, pos.y, this.r, this.r);
    pop();
  }
}
