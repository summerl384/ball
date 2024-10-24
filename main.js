//画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机颜色
function randomColor() {
  return 'rgb(' +
    random(0, 255) + ',' +
    random(0, 255) + ',' +
    random(0, 255) + ')';
}

// Shape 基类
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// Ball 类，继承自 Shape
function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY, true);

  this.color = color;
  this.size = size;
}

Ball.prototype = new Shape();
Ball.prototype.constructor = Ball;

// DemonBall 类，继承自 Shape
function DemonBall(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY, true);

  this.color = color;
  this.size = size;
}

DemonBall.prototype = new Shape();
DemonBall.prototype.constructor = DemonBall;

// Ball 的绘制
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// DemonBall 的绘制
DemonBall.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Ball 的更新
Ball.prototype.update = function() {
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
};

// DemonBall 的更新
DemonBall.prototype.update = function() {
  // 根据键盘输入更新位置
  if (keyLeft) {
    this.x -= 5;
  }
  if (keyRight) {
    this.x += 5;
  }
  if (keyUp) {
    this.y -= 5;
  }
  if (keyDown) {
    this.y += 5;
  }
  //位置限制
  if (this.x + this.size > width) {
    this.x = width - this.size;
  } else if (this.x - this.size < 0) {
    this.x = this.size;
  }
  if (this.y + this.size > height) {
    this.y = height - this.size;
  } else if (this.y - this.size < 0) {
    this.y = this.size;
  }
};
// Ball 的碰撞检测
Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
  // 检测与恶魔球的碰撞
  for (let k = 0; k < demonBalls.length; k++) {
    const dx = this.x - demonBalls[k].x;
    const dy = this.y - demonBalls[k].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + demonBalls[k].size) {
      this.exists = false; // 弹球消失
    }
  }
};

// 初始化计数器
let remainingBalls = 10;
let eatenBalls = 0;

// 主循环
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    } else {
      balls.splice(i, 1);
      eatenBalls++;
      remainingBalls--;
    }
  }

  demonBalls[0].draw();
  demonBalls[0].update();

  // 计数器
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('剩余球数: ' + remainingBalls, 10, 20);
  ctx.fillText('被吃掉的球数: ' + eatenBalls, 10, 40);
  if (remainingBalls === 0) {
    ctx.font = 'bold 24px Arial';
    ctx.fillText('你获胜了!', width / 2 - 50, height / 2);
    // 重新开始按钮
    ctx.fillStyle = 'pink';
    ctx.fillRect(width / 2 - 50, height / 2 + 30, 100, 40);
    ctx.fillStyle = 'brown';
    ctx.fillText('重新开始', width / 2 - 49, height / 2 + 55);
  }

  requestAnimationFrame(loop);
}

// 初始化弹球和恶魔球数组
const balls = [];
const demonBalls = [new DemonBall(width / 2, height / 2, 0, 0, 'rgb(0,255,196)', 40)];

// 生成初始的10个小球
for (let i = 0; i < 10; i++) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
}

// 键盘事件监听器
let keyLeft = false;
let keyRight = false;
let keyUp = false;
let keyDown = false;

window.addEventListener('keydown', function(e) {
  if (e.keyCode === 37) keyLeft = true;
  if (e.keyCode === 39) keyRight = true;
  if (e.keyCode === 38) keyUp = true;
  if (e.keyCode === 40) keyDown = true;
});

window.addEventListener('keyup', function(e) {
  if (e.keyCode === 37) keyLeft = false;
  if (e.keyCode === 39) keyRight = false;
  if (e.keyCode === 38) keyUp = false;
  if (e.keyCode === 40) keyDown = false;
});
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 按钮检测
  if (remainingBalls === 0 && x >= width / 2 - 50 && x <= width / 2 + 50 && y >= height / 2 + 30 && y <= height / 2 + 70) {
    // 重置游戏
    balls.length = 0;
    demonBalls[0].x = width / 2;
    demonBalls[0].y = height / 2;
    remainingBalls = 10;
    eatenBalls = 0;
    for (let i = 0; i < 10; i++) {
      const size = random(10, 20);
      const ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomColor(),
        size
      );
      balls.push(ball);
    }
  }
});
// 启动游戏循环
loop();


