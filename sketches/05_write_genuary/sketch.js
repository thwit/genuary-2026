let N = 60;    // number of columns
let M = 60;     // number of rows
let K = 12;    // font size

async function setup() {
  createCanvas(600, 600);
  
  // Load font asynchronously
  customFont = await loadFont("1942.ttf");

  textFont(customFont);

  textAlign(CENTER, CENTER);
  noLoop();
}

function draw() {
  background(255);

  let cellW = width / N;
  let cellH = height / M;

  let k = 0;
  let letters = ["g", "e", "n", "u", "a", "r", "y"];
  let help = ["h", "e", "l", "p"]

  for (let i = 3; i < N-3; i++) {
    for (let j = 3; j < M-3; j++) {

      // Random uppercase letter A–Z
      let letter = String.fromCharCode(97 + floor(random(26)));

      if (noise(i*0.05, j*0.05) < (random(-0.1, 0.1) + .375)) {
        letter = letters[k % letters.length];
      }

      if (noise(i*0.05, j*0.05) > (random(-0.1, 0.1) + .55)) {
        letter = help[k % help.length];
      }
      
      if (noise(100+i*0.05, j*0.03) + random(-0.1, 0.1) < 0.25) {
        continue;
      }

      console.log(letter)

      let y = i * cellW + cellW / 2;
      let x = j * cellH + cellH / 2;

      textSize(K + noise(i*0.05, 400 + j*0.05)*24 + random(-4, 4));
      text(letter, x + random(-2, 2), y + random(-2, 2));
      k++;
    }
  }
}
