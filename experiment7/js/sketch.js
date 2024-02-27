// Author: Brian Camilo, Jose Nadales
// Date: Febuary 26, 2024

let animesData = [];
let nodes = [];
let nodeDiameter = 10;
let canvasPadding = 10; 
let linkDistance = 100;
let minNodeSize = 5; // Minimum size of the node
let maxNodeSize = 20; // Maximum size of the node

function preload() {
  animesData = loadTable("animes.csv", "csv", "header");
}

function setup() {
  createCanvas(1200, 600);
  for (let i = 0; i < animesData.getRowCount(); i++) {
    let anime = animesData.getRow(i);
    nodes.push(new Node(anime, random(canvasPadding, width - canvasPadding), random(canvasPadding, height - canvasPadding)));
  }
}

function draw() {
  background(255);
  stroke(0);
  noFill();
  rect(canvasPadding, canvasPadding, width - 2 * canvasPadding, height - 2 * canvasPadding);

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].repel(nodes);
    nodes[i].checkEdges();
    nodes[i].update();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let distance = p5.Vector.dist(nodes[i].position, nodes[j].position);
      if (distance < linkDistance) {
        stroke(100);
        line(nodes[i].position.x, nodes[i].position.y, nodes[j].position.x, nodes[j].position.y);
      }
    }
  }

  for (let node of nodes) {
    node.display();
  }
}

class Node {
  constructor(anime, x, y) {
    this.anime = anime;
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.rank = anime.getNum("ranked");
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); 
  }

  checkEdges() {
    if (this.position.x <= nodeDiameter / 2 + canvasPadding || this.position.x >= width - nodeDiameter / 2 - canvasPadding) {
      this.velocity.x *= -1;
    }
    if (this.position.y <= nodeDiameter / 2 + canvasPadding || this.position.y >= height - nodeDiameter / 2 - canvasPadding) {
      this.velocity.y *= -1;
    }
  }

  repel(otherNodes) {
    for (let other of otherNodes) {
      if (other !== this) {
        let distance = this.position.dist(other.position);
        if (distance < nodeDiameter * 2) {
          let repelForce = p5.Vector.sub(this.position, other.position);
          repelForce.normalize();
          repelForce.div(distance); 
          this.applyForce(repelForce);
        }
      }
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  display() {
    let col = lerpColor(color(100, 200, 255), color(255, 0, 0), 1 - this.rank / animesData.getRowCount());
    fill(col);
    noStroke();
    ellipse(this.position.x, this.position.y, nodeDiameter, nodeDiameter);

    if (dist(mouseX, mouseY, this.position.x, this.position.y) < nodeDiameter / 2) {
      this.showTooltip();
    }
  }

  showTooltip() {
    fill(0);
    stroke(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(`Title: ${this.anime.getString("title")}\nMembers: ${this.anime.getNum("members")}\nRank: ${this.rank}`, this.position.x, this.position.y - 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

new p5();
