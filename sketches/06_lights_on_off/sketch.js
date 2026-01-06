let eyeCenters = [];
let eyeBlink = [];
let lightsOn = false;
let bgcolor = 33;
let counter = 0;

function setup() {
  createCanvas(600, 600);
  let numCircles = 10000; // Number of circles you want to pack
  let maxRadius = 250; // Maximum radius of the circles
  let minDistance = maxRadius * .5; // Minimum distance between circle centers
  let maxTries = 500;
  let curTries = 0;
  eyeCenters.push({ x: width / 2, y: height / 2, radius: maxRadius });

  while (eyeCenters.length < numCircles && curTries <= maxTries) {
    let radius = random(10, maxRadius); // Random radius for each circle
    let x = random(radius, width - radius);
    let y = random(radius, height - radius);
    let valid = true;

    // Check if the newly generated circle center is too close to existing centers
    for (let center of eyeCenters) {
      let d = dist(x, y, center.x, center.y);
      if (d < (center.radius + radius) / 2) { // Adjust minDistance considering radius
        valid = false;
        curTries++;
        break;
      }
    }

    // If the center is valid, push it to the eyeCenters array
    if (valid) {
      curTries = 0;
      eyeCenters.push({ x: x, y: y, radius: radius });
      eyeBlink.push(0);
    }
  }
}

function draw() {
  background(bgcolor);

  for (let i = 0; i < eyeCenters.length; i++) {
    
    let center = eyeCenters[i];
    let radius = center.radius;
    let dist_ = (1 - dist(center.x, center.y, width / 2, height / 2) / width);
    
    factor = lightsOn ? 0.01 : 0.001;
    nX = noise(frameCount * 0.0075, i, factor * frameCount) * 2 - 1;
    nY = noise(frameCount * 0.0075, i + 10000, factor * frameCount) * 2 - 1;
    nMag = noise(frameCount * 0.0125, i + 20000);

    col = 255 * dist_ * dist_;
    col = (min(col, 150));
    if (lightsOn) {
      col = 255;
    }
    fill(col)
    
    
    if ((random() < 0.001 || eyeBlink[i] > 0) && !lightsOn) {
      eyeBlink[i]++;
      
      if (eyeBlink[i] == 25) {
        eyeBlink[i] = 0;
      }
      fill(col - (eyeBlink[i] % 10) * col / 25);
    }
    
    
    
    
    circle(center.x, center.y, radius);

    // Draw the smaller circle (pupil)
    fill(25);
    pupCenter = createVector(center.x, center.y);
    nVec = createVector(nX, nY);
    nVec.setMag(nMag * radius / 4 )
    
    
    if (!lightsOn) {
    
      if (radius < 251) {
      pupCenter.add(nVec);
      }
      
      mVec = createVector(mouseX, mouseY);
      diff = pupCenter.copy().sub(mVec);
    } else {
      
      //pupCenter.add(createVector(4 * map(noise(pupCenter.x * 0.01, pupCenter.y * 0.01, 1000 + frameCount * 0.01), 0, 1, -1, 1), 4 * map(noise(pupCenter.x * 0.01, pupCenter.y * 0.01, frameCount * 0.01), 0, 1, -1, 1)))
      pupCenter.add(createVector(random(-.45, .45), random(-.45, .45)))
    }
    circle(pupCenter.x, pupCenter.y, radius / 2);
  }

  if (frameCount % 150 == 0) {
    mousePressed()
  }
}

function mousePressed() {
  lightsOn = !lightsOn
  bgcolor = bgcolor == 33? "#F5F2F2" : 33;
  background(33)
  counter = 0;

}