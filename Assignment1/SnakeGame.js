/* global THREE */


// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor('rgb(255,255,255)');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
camera.position.set(0, -7, 18);
scene.add(camera);

camera.lookAt(scene.position);

// grid game
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
gridHelper.rotation.x = Math.PI / 2; //to get a gray playing field in the x- y-plane
scene.add(gridHelper);

// PlaneGeometry
const playFieldColor=0xcdcdcd;
const geometryPlan = new THREE.PlaneGeometry(size, divisions);
const materialPlan = new THREE.MeshBasicMaterial({ color: playFieldColor, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometryPlan, materialPlan);
scene.add(plane);


// Variables
const RandomNumber = {
  Min: -4,
  Max: 4
};
const cubeShift = -0.5;
const randomX_cube = randomNumberMinMax(RandomNumber.Min, RandomNumber.Max);
const randomY_cube =  randomNumberMinMax(RandomNumber.Min, RandomNumber.Max);
const geometryCube = new THREE.BoxGeometry(0.95, 0.95, 1);
const SnakeBody = new Deque();


// head cube green
const headColor=0x00b200;
const materialCubeGreen = new THREE.MeshBasicMaterial({ color: headColor });
const SnakeHead = new THREE.Mesh(geometryCube, materialCubeGreen);
scene.add(SnakeHead);
SnakeHead.position.set(randomX_cube + cubeShift, randomY_cube + cubeShift, -cubeShift);

// body cubes blue
const bodyColor=0x0007E5;
const materialCubeBlue = new THREE.MeshBasicMaterial({ color: bodyColor });


// ball
const ballColor=0x912323 ;
const ballRadius=0.4;
const randomNumberX_ball = randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift;
const randomNumberY_ball = randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift;
const geometryBall = new THREE.SphereGeometry(ballRadius, 20, 16);
const materialBall = new THREE.MeshBasicMaterial({ color: ballColor });
const ball = new THREE.Mesh(geometryBall, materialBall);
ball.position.set(randomNumberX_ball, randomNumberY_ball, -cubeShift);
scene.add(ball);

SnakeHead.position.set(randomX_cube + cubeShift, randomY_cube + cubeShift, -cubeShift);
scene.add(SnakeHead);

//  move
let speed = new THREE.Vector3(0, 0, 0);
const speedValue = 1;

const controlKey = {
  Left: "ArrowLeft",
  Right: "ArrowRight",
  Up: "ArrowUp",
  Down: "ArrowDown"
};


// to control tha snake
function myCallback(event) {
  // to block move back if the snake has more than 2 cube
  if (!SnakeBody.isEmpty()) {
    if (event.key === controlKey.Left && SnakeBody.getFront().position.x != (SnakeHead.position.x - 1)) {   // left arrow key      
      speed.x = -speedValue;
      speed.y = 0;
    }
    if (event.key === controlKey.Right && SnakeBody.getFront().position.x != (SnakeHead.position.x + 1)) {   // right arrow key   
      speed.x = speedValue;
      speed.y = 0;
    }
    if (event.key === controlKey.Up && SnakeBody.getFront().position.y != (SnakeHead.position.y + 1)) {   // up arrow key     
      speed.y = speedValue;
      speed.x = 0;
    }
    if (event.key === controlKey.Down && SnakeBody.getFront().position.y != (SnakeHead.position.y - 1)) {   // down arrow key      
      speed.y = -speedValue;
      speed.x = 0;
    }
  }
  // to allow move back if the snake has just 1 cube
  else {
    if (event.key === controlKey.Left) {   // left arrow key      
      speed.x = -speedValue;
      speed.y = 0;
    }
    if (event.key === controlKey.Right) {   // right arrow key   
      speed.x = speedValue;
      speed.y = 0;
    }
    if (event.key === controlKey.Up) {   // up arrow key    
      speed.y = speedValue;
      speed.x = 0;
    }
    if (event.key === controlKey.Down) {   // down arrow key      
      speed.y = -speedValue;
      speed.x = 0;
    }
  }
}
document.addEventListener("keydown", myCallback);



// * moveSnake
const controls = new THREE.TrackballControls(camera, renderer.domElement);
const clock = new THREE.Clock();
let h = 250;



// update ball position
function moveSnake() {
  creatfood();
  const tempMoveSnake = {
    x: SnakeHead.position.x,
    y: SnakeHead.position.y
  };
  SnakeHead.position.set(tempMoveSnake.x + speed.x, tempMoveSnake.y + speed.y, -cubeShift);
  SnakeBody.insertFront(new THREE.Mesh(geometryCube, materialCubeBlue));
  SnakeBody.getFront().position.set(tempMoveSnake.x, tempMoveSnake.y, -cubeShift);
  scene.add(SnakeBody.getFront());
  scene.remove(SnakeBody.getBack());
  SnakeBody.removeBack();
  AlertResetGame();
}

const w = Math.PI;
const radiusCamera = 7;
// to move camera with w= Pi and radius=7
function moveCamera() {
  const t = clock.getElapsedTime();
  camera.position.x = radiusCamera * Math.cos(w * t);
  camera.position.y = radiusCamera * Math.sin(w * t);
}


const tempT = setInterval(moveSnake, h);

// * Render loop
function render() {
  requestAnimationFrame(render);
  moveCamera();
  controls.update();
  renderer.render(scene, camera);
}
render();





let testSnakeBody_X, testSnakeBody_Y;
//creating food for the snake
function creatfood() {
  let tempCreatfood = {
    x: SnakeHead.position.x,
    y: SnakeHead.position.y
  };
  //creating food if the position of head is position of food (ball)
  if ((SnakeHead.position.x == ball.position.x) && (SnakeHead.position.y == ball.position.y)) {

    //just one cube then take over the position of head 
    if (SnakeBody.isEmpty()) {
      tempCreatfood.x = SnakeHead.position.x;
      tempCreatfood.y = SnakeHead.position.y;
    }
    //more than one cube then take over the position of last cube in the snake 
    else {
      tempCreatfood.x = SnakeBody.getBack().position.x;
      tempCreatfood.y = SnakeBody.getBack().position.y;
    }
    SnakeBody.insertBack(new THREE.Mesh(geometryCube, materialCubeBlue));
    SnakeBody.getBack().position.set(tempCreatfood.x - speed.x, tempCreatfood.y - speed.y, 0.51);
    scene.add(SnakeBody.getBack());
    ball.position.set(randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift,
      randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift, -cubeShift);
  }
  // to test if the food is created inside the snake
  for (let i = 0; i < SnakeBody.size(); i++) {
    testSnakeBody_X = SnakeBody.getValues()[i].position.x;
    testSnakeBody_Y = SnakeBody.getValues()[i].position.y;
    if (((SnakeBody.getValues()[i].position.x == ball.position.x) && (SnakeBody.getValues()[i].position.y == ball.position.y))) {
      ball.position.set(randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift,
        randomNumberMinMax(RandomNumber.Min, RandomNumber.Max) + cubeShift, -cubeShift);
      scene.add(ball);
    }
  }
}

const endField = 5.5;
const alertMessage = "Game Over \n\nYour score: ";

//to reset the game and creat alert to report game over
function AlertResetGame() {
  let score = SnakeBody.size() + 1;
  //for Checking if the snake intersects itself
  for (let i = 2; i < SnakeBody.size(); i++) {
    testSnakeBody_X = SnakeBody.getValues()[i].position.x;
    testSnakeBody_Y = SnakeBody.getValues()[i].position.y;

    if (((testSnakeBody_X == SnakeHead.position.x) && (testSnakeBody_Y == SnakeHead.position.y))) {
      SnakeBody.clear();
      scene.remove(SnakeHead);
      alert(alertMessage + score);
      window.location.reload();
    }
  }
  // check if the head of the snake move beyond the boundaries of the playing field
  if ((SnakeHead.position.x == endField) || (SnakeHead.position.y == endField)
    || (SnakeHead.position.x == -endField) || (SnakeHead.position.y == -endField)) {
    SnakeBody.clear();
    scene.remove(SnakeHead);
    alert(alertMessage + score);
    window.location.reload();
  }
}


//random function with min and max value
function randomNumberMinMax(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
// * Deque: https://learnersbucket.com/tutorials/data-structures/implement-deque-data-structure-in-javascript/

function Deque() {
  //To track the elements from back
  let count = 0;

  //To track the elements from the front
  let lowestCount = 0;

  //To store the data
  let items = {};
  this.getValues = () => { return Object.values(items); };

  //Add an item on the front
  this.insertFront = (elm) => {

    if (this.isEmpty()) {
      //If empty then add on the back
      this.insertBack(elm);

    } else if (lowestCount > 0) {
      //Else if there is item on the back
      //then add to its front
      items[--lowestCount] = elm;

    } else {
      //Else shift the existing items
      //and add the new to the front
      for (let i = count; i > 0; i--) {
        items[i] = items[i - 1];
      }

      count++;
      items[0] = elm;
    }
  };

  //Add an item on the back of the list
  this.insertBack = (elm) => {
    items[count++] = elm;
  };

  //Remove the item from the front
  this.removeFront = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the first item and return it
    const result = items[lowestCount];
    delete items[lowestCount];
    lowestCount++;
    return result;
  };

  //Remove the item from the back
  this.removeBack = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the last item and return it
    count--;
    const result = items[count];
    delete items[count];
    return result;
  };

  //Peek the first element
  this.getFront = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[lowestCount];
  };

  //Peek the last element
  this.getBack = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[count - 1];
  };

  //Check if empty
  this.isEmpty = () => {
    return this.size() === 0;
  };

  //Get the size
  this.size = () => {
    return count - lowestCount;
  };

  //Clear the deque
  this.clear = () => {
    count = 0;
    lowestCount = 0;
    items = {};
  };

  //Convert to the string
  //From front to back
  this.toString = () => {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${items[lowestCount]}`;
    for (let i = lowestCount + 1; i < count; i++) {
      objString = `${objString},${items[i]}`;
    }
    return objString;
  };
}