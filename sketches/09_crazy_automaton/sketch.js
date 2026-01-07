let cols, rows;
let cellSize = 5;
let grid;
let nextGrid;
let coords = [];

// Colors for cell age
let colors = ['#111', '#0F0', '#3F3', '#6F6', '#9F9', '#CFC'];

function setup() {
  createCanvas(600, 600);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);

  grid = new Array(cols);
  nextGrid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    nextGrid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = random() < 0.03 ? 1 : 0; // start with sparse cells
      nextGrid[i][j] = 0;
    }
  }

  frameRate(100);
  background(33);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      coords.push([i, j]);
    }
  }

  // sort only once
  coords.sort((a, b) => random(-0.2, 0.2) + noise(a[0]*0.1, a[1]*0.07) - noise(b[0]*0.07, b[1]*0.03));

    saving = true;
    //saveGif("genuary09", 10)
}
let saving = false;
function draw() {
  background(33, 10);

  // Draw cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let age = grid[i][j];
      if (age > 0 && age < 5) {
        fill(220,33,50,150);
        noStroke()
        
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
        //circle(i * cellSize, j * cellSize, cellSize);
      }
    }
  }

  // Compute next generation in noise-driven order
  for (let k = 0; k < coords.length; k++) {
    let i = coords[k][0];
    let j = coords[k][1];
    nextGrid[i][j] = computeNextState(i, j);
  }



  // Swap grids
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
}

// Amoeba-like movement and growth
function computeNextState(x, y) {
  let state = grid[x][y];

  // Count alive neighbors and note empty directions
  let emptyNeighbors = [];
  let liveNeighbors = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let nx = (x + i + cols) % cols;
      let ny = (y + j + rows) % rows;

      if (grid[nx][ny] === 0) {
        emptyNeighbors.push([nx, ny]);
      } else {
        liveNeighbors++;
      }
    }
  }

  // Dead cell grows into empty space if adjacent to a live cell
  if (state === 0 && liveNeighbors > 0) {
    if (emptyNeighbors.length > 0 && random() < 0.125*liveNeighbors) {
      // Pick one empty neighbor randomly for growth
      let [nx, ny] = random(emptyNeighbors);
      nextGrid[nx][ny] = 1; // move/grow into empty space
    }
    return 0;
  }

  // Live cell survival and movement
  if (state > 0) {
    // Cells age
    let age = state + 1;

    if (age > 20) return int(random() > 0.5)

    // Lonely or overcrowded cells die
    if (liveNeighbors < 1 || liveNeighbors > 5) return 0;

    // Move toward empty space with some probability
    if (emptyNeighbors.length > 0 && random() < 0.3 + int(liveNeighbors > 3)*0.1) {
      let [nx, ny] = random(emptyNeighbors);
      nextGrid[nx][ny] = age; // move cell into empty spot
      return 0; // original spot becomes empty
    }

    return age;
  }

  return 0;
}
