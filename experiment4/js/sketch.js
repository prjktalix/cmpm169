// Author: Brian Camilo
// Date: 2024

// Adapted from
// Wes Modes
// Daniel Shiffman http://codingtra.in
// Video: https://youtu.be/cl-mHFCGzYk

let snow = [];
let gravity;
let textures = [];
let piles = [];
let webcam;
let spritesheet;
let popSound;
let shrekImage;


function preload() {
  spritesheet = loadImage('f32.png');
  popSound = loadSound('pop.mp3');
  shrekImage = loadImage('parrot.png');
  //shrekImage = loadImage('Shrek.png');

}

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

    webcam = createCapture(VIDEO);
    webcam.size(width, height);
    webcam.hide();

    gravity = createVector(0, 0.3);
    for (let x = 0; x < spritesheet.width; x += 32) {
        for (let y = 0; y < spritesheet.height; y += 32) {
        let img = spritesheet.get(x, y, 32, 32);
        textures.push(img);
        }
    }
    
    for (let i = 0; i < 600; i++) {
        let x = random(width);
        let y = random(height);
        let design = random(textures);
        snow.push(new Snowflake(design));
    }
    
        poseNet = ml5.poseNet(webcam);
        poseNet.on('pose', function(results) {
        poses = results;
    });
}

function draw() {
    background(0);
    image(webcam, 0, 0, width, height);
    
    for (var flake of piles) {
      push();
      translate(flake.x, flake.y);
      imageMode(CENTER);
      image(flake.img, 0, 0, flake.r, flake.r);
      pop();
    }
    
    for (flake of snow) {
      flake.applyForce(gravity);
      flake.update();
      flake.render();
    }
     
     if (poses.length > 0) {
      let pose = poses[0].pose;
      let nose = pose.nose;
      
      let imageX = nose.x + 120;
      let imageY = nose.y - 100;
      let imageWidth = shrekImage.width / 2;
      let imageHeight = shrekImage.height / 2;
      
       image(shrekImage, imageX, imageY, imageWidth, imageHeight);
    }
   }
// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}