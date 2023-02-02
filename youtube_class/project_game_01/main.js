// Canvas 세팅

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);


let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

// 우주선 좌표
let space_shipX = canvas.width/2-32
let space_shipY = canvas.height-60

let bulletList = [];  // 총알들은 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = space_shipX + 22;
    this.y = space_shipY;

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  }
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random()*(max-min+1))+min;
  return randomNum;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width-64);
    enemyList.push(this)
  };

  this.update = function () {
    this.y += 3;
  }
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src="images/space_background.jpg"

  spaceshipImage = new Image();
  spaceshipImage.src="images/space_ship.png"

  bulletImage = new Image();
  bulletImage.src="images/bullet.png"

  enemyImage = new Image();
  enemyImage.src="images/enemy.png"

  gameOverImage = new Image();
  gameOverImage.src="gameover.png"
}

let keysDown={};
function setupKeyboardListener() {
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode]

    if (event.keyCode == 32) {
      createBullet() // 스페이스 바 누를 때 총알 생성
    }
  });
}

function createBullet() {
  console.log("총알 생성!");
  let b = new Bullet(); // 총알 하나 생성
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init()
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    space_shipX += 5;  // 우주선의 속도
  } // right button
  if (37 in keysDown) {
    space_shipX -= 5;
  } // left button

  if (space_shipX <= 0) {
    space_shipX = 0;
  }

  if (space_shipX >= canvas.width - 60) {
    space_shipX = canvas.width - 60;
  }
  // 우주선의 좌표값이 무한대로 업데이트 되는 게 아닌, 캔버스 안에서만 움직이게 하려면

  // 총알의 y좌표 업데이트 하는 함수호출
  for (let i = 0; i<bulletList.length; i++) {
    bulletList[i].update();
  }

  for (let i = 0; i<enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, space_shipX, space_shipY);
  
  for (let i = 0; i < bulletList.length; i++) {
    ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  update();  // 좌표 값을 업데이트 한 후
  render();  // 그려주고   -> 미친듯이 반복하는 게 애니메이션 효과
  requestAnimationFrame(main)
}

loadImage();
setupKeyboardListener();
createEnemy();
main();


// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y 값이 --. 총알의 x 값은? 스페이스를 누른 순간의 우주선의 x 좌표
// 3. 발사된 총알들은 총알 배열에 저장한다
// 4. 모든 총알들은 x, y 좌표 값이 있어야 한다
// 5. 총알 배열을 가지고 render 그려준다

// 적군 만들기
// 1. 귀엽다:>   x,y 좌표, init 초기화, update
// 2. 위치가 랜덤으로 떨어진다
// 3. 위에서 아래로 내려온다(y좌표 증가)
// 4. 1초마다 하나씩 적군이 나온다
// 5. 적군의 우주선이 바닥에 닿으면 게임오버
// 6. 적군과 총알이 만나면 우주선이 사라진다 & 점수 1점 획득
