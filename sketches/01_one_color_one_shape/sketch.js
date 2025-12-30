let seed;

function setup() {
  createCanvas(400, 200);
  frameRate(5);
  seed = int(random(10000))
}



function draw() {
  background(0);
  randomSeed(seed);
  noiseSeed(seed);
  rectMode(CENTER)
  let i=0;
  for (let x=20; x<=width+200; x+=30) {
    let y = height / 2 + 100 * (0.5-noise(x*0.05));

    if (i == (frameCount % 20)) {  
      fill(0);
      strokeWeight(4);
      stroke(125,20,30);
    } else {  
      stroke(0);
      strokeWeight(4);
      fill(125,20,30);
    }

    push()
    translate(x, y)
    rotate(PI * noise(x*0.05))
    rect(0, 0, 200, 200)
    pop();
    i++;
  }
}

