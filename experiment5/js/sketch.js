// Author: Brian Camilo
// Date: Febuary 10, 2024

// Adapted from
// Colorful Coding
// Video: https://www.youtube.com/watch?v=uk96O7N1Yo0

var particles = [];
var song;
var fft;

class Particle {
  constructor() {
    this.pos = p5.Vector.random3D().mult(random(50, 250));
    this.vel = p5.Vector.random3D();
    this.acc = createVector(0, 0, 0);
    this.size = random(5, 20);
    this.lifeSpan = random(100, 200);
    this.color = [random(100, 255), random(100, 255), random(100, 255), random(150, 200)];

    const shapes = ['sphere', 'box', 'cylinder', 'cone'];
    this.shape = random(shapes);
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); 
    this.lifeSpan -= 1.5;
    if (cond) {
      this.vel.mult(1.05);
    }
  }

  edges() {
    if (this.lifeSpan <= 0) {
      return true;
    }
    return false;
  }

  show() {
    noStroke();
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    switch (this.shape) {
      case 'sphere':
        sphere(this.size);
        break;
      case 'box':
        box(this.size);
        break;
      case 'cylinder':
        cylinder(this.size / 2, this.size);
        break;
      case 'cone':
        cone(this.size / 2, this.size);
        break;
    }
    pop();
  }
}

function preload() {
  song = loadSound("titanium.mp3"); // credits AlisiaBeats
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  fft = new p5.FFT(0.3);
  song.play();
}

function draw() {
  background(0);

  // rotate on mouse position
  let rotateXAngle = map(mouseY, 0, height, -180, 180);
  let rotateYAngle = map(mouseX, 0, width, -180, 180);
  rotateX(rotateXAngle);
  rotateY(rotateYAngle);

  fft.analyze();
  var bass = fft.getEnergy("bass");

  // particles
  if (frameCount % 5 === 0) {
    let p = new Particle();
    particles.push(p);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(bass > 150);
    if (!particles[i].edges()) {
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}
