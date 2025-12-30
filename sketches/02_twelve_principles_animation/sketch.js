let RADIUS = 33;
let gravity = 0.27;

const lines = [];
const line_spacing = 50;

let balls = [];     // ALL active balls
let spawnInterval = 165;   // frames between new balls
let frameCountSinceSpawn = 0;


// ----------------------------------------------------------
// Ball class
// ----------------------------------------------------------
class Ball {
  constructor(x) {
    this.x = x;
    this.y = -RADIUS;
    this.y_speed = 0;
    this.y_accel = gravity;

    // squish
    this.squish = 0;
    this.instantSquish = 0;
    this.squishFactor = 20;
    this.squishHistory = [];
    this.K = 5;

    // line hits
    this.linesHit = lines.map(() => false);
  }

  update() {
    // previous speed
    let y_speed_prev = this.y_speed;

    // movement
    this.y_speed += this.y_accel;
    this.y += this.y_speed;

    // raw squish
    this.instantSquish = -this.y_speed / 16 * this.squishFactor;
    this.instantSquish = constrain(this.instantSquish, -this.squishFactor, this.squishFactor);

    // moving average
    this.squishHistory.push(this.instantSquish);
    if (this.squishHistory.length > this.K) {
      this.squishHistory.shift();
    }

    let sum = 0;
    for (let s of this.squishHistory) sum += s;
    this.squish = sum / this.squishHistory.length;

    // collisions
    for (let i = 0; i < lines.length; i++) {
      let ly = lines[i];
      if (
        this.y_speed > 0 &&
        this.y + RADIUS/2 >= ly &&
        this.y + RADIUS/2 - this.y_speed < ly &&
        !this.linesHit[i]
      ) {
        this.y = ly - RADIUS/2;
        this.y_speed *= -0.6;
        this.y_accel = gravity;
        this.linesHit[i] = true;
        break;
      }
    }
  }

  draw() {
    let w = RADIUS + this.squish;
    let h = RADIUS - this.squish;

    strokeWeight(2);
    fill(200, 0, 0);
    ellipse(this.x, this.y, w, h);
  }

  isOffscreen() {
    return this.y - RADIUS*2 > height;
  }
}


// ----------------------------------------------------------
// p5 setup
// ----------------------------------------------------------
function setup() {
  createCanvas(200, 400);

  // horizontal lines
  for (let y = 50; y <= height - 200; y += line_spacing) {
    lines.push(y);
  }

  // spawn the first ball
  balls.push(new Ball(width / 2));
}


// ----------------------------------------------------------
// p5 draw loop
// ----------------------------------------------------------
function draw() {
  background(0);

  // draw lines
  for (let i=0; i<lines.length; i++) {
    y = lines[i]
    noStroke()
    fill((255/lines.length)*(lines.length-i-1))
    rect(0, y, width, line_spacing)
    //line(0, y, width, y);
  }
  noStroke();

  // spawn a new ball every N frames
  frameCountSinceSpawn++;
  if (frameCountSinceSpawn >= spawnInterval) {
    
    balls.push(new Ball(width / 2));
    frameCountSinceSpawn = 0;
  }

  // update and draw all balls
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    b.update();
    b.draw();

    if (b.isOffscreen()) {
      balls.splice(i, 1);
    }
  }
}
