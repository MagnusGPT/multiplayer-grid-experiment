const socket = io();

const container = document.getElementById('grid-container');

function renderGrid(data) {
  // Clear the container first
  container.innerHTML = ''; 

  // Loop through rows
  for (let r = 49; r >= 0; r--) {
    // Loop through columns
    for (let c = 0; c < 50; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // If the array value is 1, make it look "active"
      if (data[r][c] !== 0) {
        cell.classList.add('active');
      }

      container.appendChild(cell);
    }
  }
}

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === 'w') socket.emit("playerUp");
    if (key === 'a') socket.emit("playerLeft");
    if (key === 's') socket.emit("playerDown");
    if (key === 'd') socket.emit("playerRight");
});

socket.on("updateWorld", (world) => {
    renderGrid(world.grid);
});