// Author: Brian Camilo
// Date: 2024

// Adapted from
// Wes Modes
// Daniel Shiffman http://codingtra.in
// Video: https://youtu.be/cl-mHFCGzYk

let poses = [];

class Snowflake {
  constructor(img) {
    this.randomize();
    this.img = img;
    this.angle = random(TWO_PI);
    this.dir = (random(1) > 0.5) ? 1 : -1;
    this.xOff = 0;
  }

  applyForce(force) {
    let f = force.copy();
    f.mult(this.r);
    this.acc.add(f);
  }

  randomize() {
    let x = random(width);
    let y = random(-100, -10);
    let z = random(0, 100);
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    this.r = this.getSize(z);
  }
  
 

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.r * 0.2);
    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }
    
    if (!this.checkShoulderCollision()) {
      this.pos.add(this.vel);    

      this.pos.add(this.vel);
      this.acc.mult(0);

      if (this.pos.y > height + this.r) {
        this.randomize();
      }
      if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
      }
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
      }
      this.angle += this.dir * this.vel.mag() / 200;
    
    }
  }

  render() {
    push();
    translate(this.pos.x + this.xOff, this.pos.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.img, 0, 0, this.r, this.r);
    pop();
  }

  getSize(z) {
    return map(z, 0, 100, 24, 1);
  }
  
   checkShoulderCollision() {
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
      let leftShoulder = pose.leftShoulder;
      let rightShoulder = pose.rightShoulder;

      let dLeft = dist(this.pos.x, this.pos.y, leftShoulder.x, leftShoulder.y);
      let dRight = dist(this.pos.x, this.pos.y, rightShoulder.x, rightShoulder.y);

      if (dLeft < 20 || dRight < 20) {
        //popSound.play();
        this.hasPlayedSound = true;
        this.vel.mult(0);
        return true;
      }
    }
     
      if (this.hasPlayedSound) {
      this.hasPlayedSound = false;
    }
    return false;
  }
}


