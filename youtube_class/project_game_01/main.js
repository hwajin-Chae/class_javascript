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

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src="images/space_background.jpg"

  spaceshipImage = new Image();
  spaceshipImage.src="images/space_ship.png"

  bulletImage = new Image();
  bulletImage.src="images/bullet.png"

  enemyImage = new Image();
  bulletImage.src="images/enemy.png"

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
  });
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
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, space_shipX, space_shipY);
}

function main() {
  update();  // 좌표 값을 업데이트 한 후
  render();  // 그려주고   -> 미친듯이 반복하는 게 애니메이션 효과
  requestAnimationFrame(main)
}

loadImage();
setupKeyboardListener();
main();

