let cellSize = 10;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let mainCanvas;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  var query = "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)";

  if (matchMedia(query).matches) {
    mainCanvas = createCanvas((window.screen.width * 0.57) / 2, (window.screen.height * 0.57) / 2);
  } else {
    mainCanvas = createCanvas((window.screen.width * 0.57), (window.screen.height * 0.57));
  }
  
  mainCanvas.parent("p5canvas");
  document.querySelector('.p5Canvas').addEventListener('click', spawnGlider);

  if (window.screen.width>2560){
    cellSize = 20;
  }

  // Calculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Set each column in current cells to an empty array
  // This allows cells to be added to this array
  // The index of the cell will be its row number
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
  }

  // Repeat the same process for the next cells
  for (let column = 0; column < columnCount; column++) {
    nextCells[column] = [];
  }
  randomizeBoard();
  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );
}

function draw() {
  generate();
  render();
}

function render() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];

      // Convert cell value to get black (0) for alive or white (255 (white) for dead
      fill((1 - cell) * 255);
      stroke(235);
      rect(column * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function spawnGlider(e) {
  noLoop();
  offsetX = int((mouseX / width) * currentCells.length);
  offsetY = int((mouseY / height) * currentCells[0].length)

  //create a glider
  currentCells[offsetX][offsetY] = 1;
  currentCells[offsetX + 1][offsetY + 1] = 1;
  currentCells[offsetX + 1][offsetY + 2] = 1;
  currentCells[offsetX][offsetY + 2] = 1;
  currentCells[offsetX - 1][offsetY + 2] = 1;

  render();
  loop();
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      //currentCells[column][row] = random([0, 1]);
      currentCells[column][row] = round(noise(row, column) * 1)
    }
  }
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Column left of current cell
      // if column is at left edge, use modulus to wrap to right edge
      let left = (column - 1 + columnCount) % columnCount;

      // Column right of current cell
      // if column is at right edge, use modulus to wrap to left edge
      let right = (column + 1) % columnCount;

      // Row above current cell
      // if row is at top edge, use modulus to wrap to bottom edge
      let above = (row - 1 + rowCount) % rowCount;

      // Row below current cell
      // if row is at bottom edge, use modulus to wrap to top edge
      let below = (row + 1) % rowCount;

      // Count living neighbors surrounding current cell
      let neighbours =
        currentCells[left][above] +
        currentCells[column][above] +
        currentCells[right][above] +
        currentCells[left][row] +
        currentCells[right][row] +
        currentCells[left][below] +
        currentCells[column][below] +
        currentCells[right][below];

      // Rules of Life
      // 1. Any live cell with fewer than two live neighbours dies
      // 2. Any live cell with more than three live neighbours dies
      if (neighbours < 2 || neighbours > 3) {
        nextCells[column][row] = 0;
        // 4. Any dead cell with exactly three live neighbours will come to life.
      } else if (neighbours === 3) {
        nextCells[column][row] = 1;
        // 3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.
      } else nextCells[column][row] = currentCells[column][row];
    }
  }

  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}