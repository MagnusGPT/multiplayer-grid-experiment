const socket = io();


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const cellSize = canvas.width / gridSize;
const coordinates = document.getElementById('coordinates');

function renderGrid(world) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 2. Loop through the 2D array
  for (let r = gridSize - 1; r >= 0; r--) {
      for (let c = 0; c < gridSize; c++) {
          const cellData = world.grid[r][c];
          if (cellData !== 0) {
              // 3. Set the "paint" color to the hex code in the array
              ctx.fillStyle = cellData.color;
              
              // 4. Draw a rectangle: ctx.fillRect(x, y, width, height)
              // Note: We multiply index by cellSize to get pixel position
              // We use (gridSize - 1 - r) if you want to keep your bottom-up logic
              ctx.fillRect(c * cellSize, (gridSize - 1 - r) * cellSize, cellSize, cellSize);
          }
      }
  }
}

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key in keys) keys[key] = true;
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();

  if (key in keys) keys[key] = false;
});

socket.on('tick', ()=>{
  if(keys.w) socket.emit('playerUp');
  if(keys.a) socket.emit('playerLeft');
  if(keys.s) socket.emit('playerDown');
  if(keys.d) socket.emit('playerRight');
});

socket.on("updateWorld", (world) => {
    renderGrid(world);

    console.log(world);
    coordinates.textContent = `${world.users[socket.id].x}, ${world.users[socket.id].y}`;
});