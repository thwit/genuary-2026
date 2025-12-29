let coords = [];

function setup() {
  createCanvas(400, 200);
  
  for (let x=20; x<=width-20; x+=10) {
    let y = height / 2 + 100 * (0.5-noise(x*0.05));
    let r = PI * random(-1,1);
    coords.push([x, y, r]);
  }

  frameRate(20)
}

function draw() {
  background(0);

  fill(125,20,30);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER)

  coord = coords[frameCount % coords.length];
  let x = coord[0];
  let y = coord[1];
  let r = coord[2];
  
  console.log(x, y, r)
  push()
  translate(x, y)
  rotate(r)
  rect(0, 0, 25, 25)
  pop();
}

