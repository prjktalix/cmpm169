// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

let cloudx = 100;
let cloudy = 100;
let clouds = [];

let currentColor;
let lastColorChangeTime = 0;
let colorChangeInterval = 100;

let levelOneNoiseScale = 0.02;
let levelTwoNoiseScale = 0.01;
let levelThreeNoiseScale = 0.001;

let t = 0;

// setup() function is called once when the program starts
function setup() {
    // place our canvas, making it fit our container
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });
    // create an instance of the class
    myInstance = new MyClass(VALUE1, VALUE2);

    var centerHorz = windowWidth / 2;
    var centerVert = windowHeight / 2;
    
    noStroke();
    background(255, 222, 173);
    currentColor = color(random(0,100), random(0, 100), random(100, 255));
}

function draw() {
  
    if (millis() - lastColorChangeTime > colorChangeInterval) {
      currentColor = color(random(0,100), random(0, 100), random(100, 255));
      lastColorChangeTime = millis();
    }
    t += 0.25;
  
   let waves = [];
    
    for (let x = 0; x <= width; x++) {
      let levelOneNoise = scaledNoise(x, t, 1, levelOneNoiseScale, 1, 0);
  
      let levelTwoNoise = scaledNoise(x, t, 2, levelTwoNoiseScale, 2, 1000);
      let levelTwobNoise = scaledNoise(x, t, 0.4, levelTwoNoiseScale, 2.5, 4000);
      let levelThreeNoise = scaledNoise(x, t, 3.5, levelThreeNoiseScale, 3, 5000);
  
      let noises = levelOneNoise + levelTwoNoise + levelThreeNoise;
  
      let centerY = height / 2;
      let noisesScaled = map(noises, 1, 5, centerY - 55, centerY + 55);
      
      waves.push(noisesScaled);
    }
    
    noStroke();
    drawShape(waves, color(currentColor, sinEase(t/7, 4) + waves[0] + 5), sinEase(t/19, 7));
    
    fill('#B22222');
    rect(188, 57, 31, 500);
    rect(782, 57, 31, 500);
    rect(0, 364, 1000, 50);
  
    noFill();
    stroke('#B22222');
    strokeWeight(5);
    arc(500, 60, 560,600, 0, PI);  // mid
    arc(1064, 60, 500, 600, HALF_PI, PI);// right
    arc(-64, 60, 500, 600, 0, HALF_PI);// left
    
    line(50, 327, 50, 375);
    line(100, 288, 100, 375);
    line(150, 218, 150, 375);
    line(250, 195, 250, 375);
    line(300, 270, 300, 375);
    line(350, 315, 350, 375);
    line(400, 342, 400, 375);
    line(450, 358, 450, 375);
    line(550, 358, 550, 375);
    line(600, 342, 600, 375);
    line(650, 315, 650, 375);
    line(700, 270, 700, 375);
    line(750, 195, 750, 375);
    line(850, 218, 850, 375);
    line(900, 288, 900, 375);
    line(950, 327, 950, 375);
    
     
  }
  
  // lots of reference from stungeye for waves
  function sinEase(x, scale) {
    return scale * 0.5 * sin(x) + 2.5;
  }
  
  function scaledNoise(position, time, speedScale = 1, zoomScale = 1, amplitudeScale = 1, offset = 0) {
    let positionInTime = position + (speedScale * time) + (offset * speedScale);
    return amplitudeScale * noise(positionInTime * zoomScale);
  }
  
  function drawShape(points, color, offset = 0) {
    fill(color);
    
    beginShape();
    
    for (let x = 0; x <= width; x++) {
      vertex(x, points[x] + offset);
    }
    
    vertex(width + 1, height + 1);
    vertex(0 , 0) ;
    
    endShape();
  }
  
  
  // cloud function from mena-landry
  function makeCloud(cloudx, cloudy) {
  fill(250);
    noStroke();
    
    if (mouseY < height / 2) {
      fill(random(0, 255), random(0, 255), random(0, 255));
    } else{
      fill(random(0, 50), random(0, 50), random(0, 50));
    }
  
    for (let i = 0; i < 6; i++) {
      let cloudSize = random(-1, 5);
      let cloudSizeX = random(-1, 20);
      let cloudsizeY = random(-1, 20);
      ellipse(
        cloudx + cloudSizeX,
        cloudy + cloudsizeY,
        random(1, 70) + cloudSize, 
        random(1, 50) + cloudSize
      );
    }
  }
  function mousePressed() {
    
    let cloudRadius = 25;
    // reference no overlap by slow_izzm https://editor.p5js.org/slow_izzm/sketches/HyqLs-7AX
    let overlapping = false;
    for (let i = 0; i < clouds.length; i++) {
      let other = clouds[i];
      let d = dist(mouseX, mouseY, other.x, other.y);
      if (d < cloudRadius + other.radius) {
        overlapping = true;
        break;
      }
    }
  
    if (!overlapping) {
      if (mouseY < height / 2) {
        makeCloud(mouseX, mouseY);
      } else {
        makeCloud(mouseX, mouseY);
        clouds.push({ x: mouseX, y: mouseY, radius: cloudRadius });
      }
    }
  }