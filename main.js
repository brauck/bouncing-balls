// Thanks to Renan Martineli for this version of the demo

// setup canvas

const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
};

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {

  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

}

class Ball extends Shape {

  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);

    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }


  collisionDetect() {
     for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
           const dx = this.x - ball.x;
           const dy = this.y - ball.y;
           const distance = Math.sqrt(dx * dx + dy * dy);

           if (distance < this.size + ball.size) {
             ball.color = this.color = randomRGB();
           }
        }
     }
  }

}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 5, 5);

    this.color = "white";
    this.size = 10;
    this.keyState = {};
    this.initialVelX = this.velX;
    this.initialVelY = this.velY;

    // velocities for diagonal movement

    this.diagonalXY = Math.sqrt(this.velX * this.velX + this.velY * this.velY);
    this.diagonalVelX = this.velX / this.diagonalXY * this.velX;
    this.diagonalVelY = this.velY / this.diagonalXY * this.velY;

    window.addEventListener('keydown', (e) => {
      this.keyState[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keyState[e.code] = false;
    });
  }

  moveEvilBall() {
    if (
        this.keyState.KeyA && this.keyState.KeyW ||
        this.keyState.KeyW && this.keyState.KeyD ||
        this.keyState.KeyS && this.keyState.KeyD ||
        this.keyState.KeyA && this.keyState.KeyS )
    {
        this.velX = this.diagonalVelX;
        this.velY = this.diagonalVelY; 
    } else {
        this.velX = this.initialVelX;
        this.velY = this.initialVelY;
    }

    if (this.keyState.KeyA){
        this.x -= this.velX;
    }   
    if (this.keyState.KeyD){
        this.x += this.velX;
    }
    if (this.keyState.KeyW){
        this.y -= this.velY;
    }    
    if (this.keyState.KeyS){
        this.y += this.velY;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

   checkBounds() {
      if ((this.x + this.size) >= width) {
         this.x = width - this.size;
      }

      if ((this.x - this.size) <= 0) {
         this.x = this.size;
      }

      if ((this.y + this.size) >= height) {
         this.y = height - this.size;
      }

      if ((this.y - this.size) <= 0) {
         this.y = this.size;
      }
   }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = 'Ball count: ' + count;
        }
      }
    }
  }

}

// define array to store balls and populate it

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

const evilBall = new EvilCircle(random(0, width), random(0, height));

function gameLoop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilBall.moveEvilBall();
  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  //setTimeout(gameLoop, 10);
  requestAnimationFrame(gameLoop);
}

gameLoop();

