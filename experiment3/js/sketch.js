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
let x = [];
let y = [];
let u = 20;
let s = 3;
let r = 200;
let xOld = [];
let yOld = [];
let m, n, v;
let trailLength = 10;
let color = 0;

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

    colorMode(HSB, 360, 100, 100, 100);
  m = width / 2;
  n = height / 2;
  v = radians(360 / u);
  for (let i = 0; i < u; i++) {
    x[i] = cos(v * i) * r;
    y[i] = sin(v * i) * r;
    xOld[i] = new Array(trailLength).fill(x[i]);
    yOld[i] = new Array(trailLength).fill(y[i]);
  }
  strokeWeight(1);
  background(0);
  frameRate(30);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    background(220);    
    // call a method on the instance
    myInstance.myMethod();

    // Put drawings here
    var centerHorz = canvasContainer.width() / 2 - 125;
    var centerVert = canvasContainer.height() / 2 - 125;
    fill(234, 31, 81);
    noStroke();
    rect(centerHorz, centerVert, 250, 250);
    fill(255);
    textStyle(BOLD);
    textSize(140);
    text("p5*", centerHorz + 10, centerVert + 200);
}

function draw() {
    background(0, 15);
    color = (color + 1) % 360;
    
    for (let i = 0; i < u; i++) {
      
      x[i] += random(-s, s);
      y[i] += random(-s, s);
      
      // update history and draw trail lines
      xOld[i].unshift(x[i]);
      yOld[i].unshift(y[i]);
      if (xOld[i].length > trailLength) xOld[i].pop();
      if (yOld[i].length > trailLength) yOld[i].pop();
      
      for (let j = 0; j < xOld[i].length - 1; j++) {
        stroke((color + i * 18) % 360, 80, 90, map(j, 0, xOld[i].length - 1, 100, 0));
        line(xOld[i][j], yOld[i][j], xOld[i][j + 1], yOld[i][j + 1]);
      }
      
      fill((color + i * 18) % 360, 80, 90);
      let dynamicRadius = map(dist(mouseX, mouseY, m, n), 0, width, 10, r);
      ellipse(x[i], y[i], dynamicRadius * 0.1, dynamicRadius * 0.1);
    }
  }
  
  function mousePressed() {
    m = mouseX;
    n = mouseY;
    r = random(100, 300);    
    for (let i = 0; i < u; i++) {
      x[i] = cos(v * i) * r + m;
      y[i] = sin(v * i) * r + n;
      xOld[i] = new Array(trailLength).fill(x[i]);
      yOld[i] = new Array(trailLength).fill(y[i]);
    }
  }