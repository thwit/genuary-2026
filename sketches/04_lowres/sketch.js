let img;

async function setup() {
  img = await loadImage('image.jpg');
  createCanvas(img.width, img.height);
  noLoop();
}

function draw() {
  background(220);

  img.loadPixels();

  const w = img.width;
  const h = img.height;

  // Iterate column by column
  for (let x = 0; x < w; x++) {
    let columnPixels = [];

    // Extract all pixels in this column
    for (let y = 0; y < h; y++) {
      let index = 4 * (y * w + x);

      // Store pixel data
      columnPixels.push({
        r: img.pixels[index + 0],
        g: img.pixels[index + 1],
        b: img.pixels[index + 2],
        a: img.pixels[index + 3],
        brightness: brightnessFromRGB(
          img.pixels[index + 0],
          img.pixels[index + 1],
          img.pixels[index + 2]
        )
      });
    }

    // Sort this column by brightness
    columnPixels.sort((a, b) => a.brightness - b.brightness);

    // Write sorted pixels back into the image
    for (let y = 0; y < h; y++) {
      let index = 4 * (y * w + x);
      let p = columnPixels[y];

      img.pixels[index + 0] = p.r;
      img.pixels[index + 1] = p.g;
      img.pixels[index + 2] = p.b;
      img.pixels[index + 3] = p.a;
    }
  }

  img.updatePixels();
  image(img, 0, 0);
}


// Simple perceptual brightness function
function brightnessFromRGB(r, g, b) {
  if (random() > 0.6 ) {
    return b 
  }
    return 0.299 * r + 0.587 * g + 0.114 * b;
}
