// Canvas 세팅

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);


let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;  // true - 게임 끝남. false - 게임 안 끝남
let score = 0;

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

    this.alive = true; // true - 살아있는 총알, false - 죽은 총알

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      console.log("왜 안돼?", enemyList);


      if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40) {
        // 총알이 죽게됨. 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false; // 죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
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
    this.y += 2;  // 적군의 속도 조절
    if(this.y >= canvas.height-64) {
      gameOver = true;
      console.log("gameover");
    }
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
  gameOverImage.src="images/gameover.png"
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
  for (let i = 0; i < bulletList.length; i++) {
    bulletList[i].update();
    bulletList[i].checkHit();
  }

  for (let i = 0; i<enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, space_shipX, space_shipY);
  
  for (let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if(!gameOver) {
    update();  // 좌표 값을 업데이트 한 후
    render();  // 그려주고   -> 미친듯이 반복하는 게 애니메이션 효과
    requestAnimationFrame(main)
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380)
  };
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

// 적군이 죽는다
// 1. 총알이 적군에게 닿는다
// ---> 총알.y <= 적군.y
// ---> 총알.x >= 적군.x  and  총알.x <= 적군.x + 적군의 너비
// == 닿았다
// === 총알이 죽게됨, 적군의 우주선이 없어짐, 점수 획득



// 사용된 JS 개념
// 캔버스: 웹에서 드로잉해야될때, 캔버스 라이브러리 많이 씀
// DOM API(엘리먼트 만들어서 특정 위치에 붙이기)
// 재귀함수
// 객체 생성자 함수와 this의 사용
// 사용자 정의 객체 생성
// 키보드 이벤트와 키코드 => 키
// 지정된 범위에서 랜덤값 만들기





// ***** 강사쌤 분석 및 총알 수정 *****


// 바꿀점
// 세미콜론 습관...
// 우주선 정중앙 안맞음 let space_shipX = canvas.width/2-32 <-- -30임
// keyCode 지양할것 key로 바꾸셈, deprecated라는것은 항상 대체제가 있음

// if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40); {
// 세미콜론 제거
// 범위 +40이 아님... 에너미의 가로폭 만큼 더해줘야 함

// 총알의 y좌표 업데이트 하는 함수 호출
// for (let i = 0; i < bulletList.length; i++) {
// if (bulletList[i].alive) {
// bulletList[i].update();
// bulletList[i].checkHit();
// }
// }