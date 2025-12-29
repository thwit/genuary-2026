function setup() {
  createCanvas(400, 200);
  noLoop();
}

function draw() {
  background(0);

  fill(125,20,30);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER)

  for (let x=20; x<=width-20; x+=10) {
    let y = height / 2 + 100 * (0.5-noise(x*0.05));

    push()
    translate(x, y)
    rotate(PI * random(-1,1))
    rect(0, 0, 25, 25)
    pop();
  }
}

