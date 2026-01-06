function setup() {
  createCanvas(1400, 1400);
  pixelDensity(1);  // ensures consistent pixel indexing
  noLoop();         // optional if you only want to draw once
}

function draw() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (y * width + x) * 4;

      let xn_raw = noise(x*0.003/5, y*0.001/5, 100)
      let yn_raw = noise(x*0.003/5, y*0.003/5)
      let xn = xn_raw > 0.5;
      let yn = yn_raw > 0.5;
      let rn = random();

      let r = 255 * ((xn ^ yn) ^ (rn < abs(yn_raw-xn_raw)+0.25))
      r = min(r, 200)

      let g = r;
      let b = r;
      // Example: color based on position
      pixels[idx] = r;        // R
      pixels[idx + 1] = g;    // G
      pixels[idx + 2] = b; // B
      pixels[idx + 3] = 255;        // A
    }
  }

  updatePixels();
}
// Save the canvas when 's' is pressed
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('myCanvas', 'png');
  }
}