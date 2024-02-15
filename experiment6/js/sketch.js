// Author: Brian Camilo
// Date: Febuary 14, 2024

// Adapted from
// servetgulnaroglu
// Source code: https://github.com/servetgulnaroglu/cube.c/blob/master/cube.c


let A = 0, B = 0, C = 0;
let cubeWidth = 20;
const width = 160, height = 44;
const zBuffer = new Array(width * height); 
let buffer = new Array(width * height);
const backgroundASCIICode = '.';
const distanceFromCam = 100;
let horizontalOffset;
const K1 = 40;
const incrementSpeed = 0.6;
let cubes = [
  { size: 20, offset: -40 },
  { size: 10, offset: 10 },
  { size: 5, offset: 40 }
];

let spinning = false;

function setup() {
  createCanvas(800, 400);
  textSize(8);
  noStroke();
  frameRate(30);
}

let textCounter = 0;

let inputText = 'All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.';

function calculateX(i, j, k) {
  return j * sin(A) * sin(B) * cos(C) - k * cos(A) * sin(B) * cos(C) +
         j * cos(A) * sin(C) + k * sin(A) * sin(C) + i * cos(B) * cos(C);
}

function calculateY(i, j, k) {
  return j * cos(A) * cos(C) + k * sin(A) * cos(C) -
         j * sin(A) * sin(B) * sin(C) + k * cos(A) * sin(B) * sin(C) -
         i * cos(B) * sin(C);
}

function calculateZ(i, j, k) {
  return k * cos(A) * cos(B) - j * sin(A) * cos(B) + i * sin(B);
}

function calculateForSurface(cubeX, cubeY, cubeZ, ch, cubeSize) {
  let x = calculateX(cubeX, cubeY, cubeZ);
  let y = calculateY(cubeX, cubeY, cubeZ);
  let z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

  let ooz = 1 / z;

  let xp = (width / 2 + horizontalOffset + K1 * ooz * x * 2);
  let yp = (height / 2 + K1 * ooz * y);

  let idx = Math.floor(xp) + Math.floor(yp) * width;
  if (idx >= 0 && idx < width * height) {
    if (ooz > zBuffer[idx]) {
      zBuffer[idx] = ooz;
      buffer[idx] = ch;
    }
  }
}

function drawCube(cube) {
  cubeWidth = cube.size;
  horizontalOffset = cube.offset;
  
  for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
    for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
      let faceIndex = Math.floor(cubeX + cubeWidth) + Math.floor(cubeY + cubeWidth) * cube.size * 2;
      let ch = inputText[faceIndex % inputText.length];
      calculateForSurface(cubeX, cubeY, -cubeWidth, ch, cube.size);
      calculateForSurface(cubeWidth, cubeY, cubeX, ch, cube.size);
      calculateForSurface(-cubeWidth, cubeY, -cubeX, ch, cube.size);
      calculateForSurface(-cubeX, cubeY, cubeWidth, ch, cube.size);
      calculateForSurface(cubeX, -cubeWidth, -cubeY, ch, cube.size);
      calculateForSurface(cubeX, cubeWidth, cubeY, ch, cube.size);
    }
  }
}

function draw() {
  background(0);
  fill(255);
  buffer.fill(backgroundASCIICode);
  zBuffer.fill(0);
  if (!spinning) {
    textCounter = 0;
  }

  cubes.forEach(cube => drawCube(cube));

  for (let i = 0; i < buffer.length; i++) {
    let x = i % width;
    let y = Math.floor(i / width);
    text(buffer[i], x * 5, y * 9);
  }
  
  if (spinning) {
    A += 0.05;
    B += 0.05;
    C += 0.01;
  }
}

function keyPressed() {
  if (key === ' ') {
    spinning = !spinning;
  }
}