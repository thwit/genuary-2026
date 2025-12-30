// --------------------------
// CONFIGURATION PARAMETERS
// --------------------------

// Number of fib(n) blocks to draw
let numBlocks = 7;

// Size of each drawn cell (pixel)
let cellSize = 40;

let colors = [
  "#FF0000", // Pure Red
  "#0057A8", // Mondrian-style Deep Blue
  "#FFD700", // Vivid Yellow
  "#585757ff", // Black (structural lines)
  "#137e33ff", // White (negative space)
  "#F2F2F2", // Light Gray (subtle variation in neutrals)
  "#C7A252", // Muted Gold (adds warmth without deviating from style)
  "#f1960eff"  // Near-Black (soft contrast alternative)
];
// --------------------------

function setup() {
  createCanvas(400, 400);
  background(220);
  noLoop();
}

function draw() {
  background("#e8ddc4ff");
  shuffle(colors, true)

  // Center starting point
  let x = width / 2 - cellSize;
  let y = height / 2 - cellSize;

  // Spiral direction vectors (clockwise)
  const dirs = [
    [1, 0],   // right
    [0, 1],   // down
    [-1, 0],  // left
    [0, -1]   // up
  ];

  let dirIndex = 0;
  let stepsInCurrentLeg = 1; // number of steps before turning
  let stepsTaken = 0;
  let legCount = 0;

  for (let n = 1; n <= numBlocks; n++) {
    let K = fib(n);

    fill(colors[n - 1]);
    stroke("#e8ddc4ff");
    strokeWeight(8);

    // Store all rects of this block as grid cells
    let cells = [];

    for (let k = 0; k < K; k++) {
      cells.push([x, y]);  // store cell position (upper-left corner)

      // Step the spiral
      x += dirs[dirIndex][0] * cellSize;
      y += dirs[dirIndex][1] * cellSize;

      stepsTaken++;

      if (stepsTaken === stepsInCurrentLeg) {
        stepsTaken = 0;
        dirIndex = (dirIndex + 1) % 4;
        legCount++;
        if (legCount % 2 === 0) stepsInCurrentLeg++;
      }
    }

    // ============= BUILD OUTER BOUNDARY =============
    // Map to track edges: key = "x1,y1|x2,y2"
    let edgeMap = new Map();

    function addEdge(x1, y1, x2, y2) {
      // normalize orientation so duplicates match exactly
      let key =
        x1 < x2 || (x1 === x2 && y1 < y2)
          ? `${x1},${y1}|${x2},${y2}`
          : `${x2},${y2}|${x1},${y1}`;

      if (edgeMap.has(key)) {
        edgeMap.delete(key);        // internal edge — remove
      } else {
        edgeMap.set(key, [x1, y1, x2, y2]); // boundary candidate
      }
    }

    // Add 4 edges for every cell
    for (let [cx, cy] of cells) {
      let x1 = cx, y1 = cy;
      let x2 = cx + cellSize, y2 = cy + cellSize;

      addEdge(x1, y1, x2, y1);   // top
      addEdge(x1, y2, x2, y2);   // bottom
      addEdge(x1, y1, x1, y2);   // left
      addEdge(x2, y1, x2, y2);   // right
    }

    // Collect edges into adjacency for chaining
    let adjacency = new Map();
    function addAdj(a, b) {
      let k = `${a[0]},${a[1]}`;
      if (!adjacency.has(k)) adjacency.set(k, []);
      adjacency.get(k).push(b);
    }

    for (let [, e] of edgeMap.entries()) {
      let a = [e[0], e[1]];
      let b = [e[2], e[3]];
      addAdj(a, b);
      addAdj(b, a);
    }

    // ============= TRACE THE PERIMETER =============
    // pick an arbitrary start vertex (lowest y, then x)
    let vertices = [...adjacency.keys()]
      .map(key => key.split(',').map(Number))
      .sort((p, q) => (p[1] - q[1]) || (p[0] - q[0]));

    let start = vertices[0];
    let startKey = `${start[0]},${start[1]}`;

    let poly = [];
    let current = start;
    let prevKey = null;

    while (true) {
      poly.push(current);
      let key = `${current[0]},${current[1]}`;
      let nextCandidates = adjacency.get(key);
      let nextVertex = null;

      if (prevKey === null) {
        nextVertex = nextCandidates[0];
      } else {
        // choose neighbor that is not the previous vertex
        nextVertex = nextCandidates.find(
          v => `${v[0]},${v[1]}` !== prevKey
        );
      }

      let nextKey = `${nextVertex[0]},${nextVertex[1]}`;
      if (nextKey === startKey) break;

      prevKey = key;
      current = nextVertex;
    }

    // ============= DRAW THE SINGULAR OUTLINE SHAPE =============
    beginShape();
    for (let [vx, vy] of poly) vertex(vx, vy);
    endShape(CLOSE);
  }

}

// --------------------------
// Fibonacci (fast iterative)
// --------------------------
function fib(n) {
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let t = a + b;
    a = b;
    b = t;
  }
  return b;
}