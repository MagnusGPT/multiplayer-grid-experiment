const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const world = {
    users: {}
}
let worldTick = 0;
const initialPos = [25, 25];

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

io.on('connection', (socket) => {
    console.log(socket.id, 'connected.');

    world.users[socket.id] = {
        x: 25,
        y: 25,
        color: getRandomColor()
    }

    let currentPos = [...initialPos];
    
    // Add the player setter here.
    while(true) {
        if(isOccupied(...currentPos)) {
            currentPos[0]++;
        }
        else {
            const u = world.users[socket.id];
            u.x = currentPos[0];
            u.y = currentPos[1];
            break;
        }
    }

    socket.on('playerRight', ()=>{
        const u = world.users[socket.id];
        if (u.x < 49 && !isOccupied(u.x + 1, u.y)) {
            u.x++;
        }
    });

    socket.on('playerLeft', ()=>{
        const u = world.users[socket.id];
        if (u.x > 0 && !isOccupied(u.x - 1, u.y)) {
            u.x--;
        }
    });

    socket.on('playerUp', ()=>{
        const u = world.users[socket.id];
        if (u.y < 49 && !isOccupied(u.x, u.y + 1)) {
            u.y++;
        }
    });

    socket.on('playerDown', ()=>{
        const u = world.users[socket.id];

        if (u.y > 0 && !isOccupied(u.x, u.y - 1)) {
            u.y--;
        }
    });

    socket.on('disconnect', () => {
        delete world.users[socket.id];
        console.log(socket.id, 'disconnected.');
    });
});

function updateGrid() {
    const grid = Array.from({ length: 50 }, () => Array(50).fill(0));

    for(let user in world.users) {
        const u = world.users[user];
        grid[u.y][u.x] = u;
    }

    return grid;
}

function isOccupied(x, y) {
    for (let id in world.users) {
        const u = world.users[id];
        if(u.x === x && u.y === y) return true;
    }
    return false;
}

setInterval(() => {
    worldTick++;
    io.emit("tick", {
        tick: worldTick,
        grid: updateGrid()
    });
}, 50);

server.listen(3000, () => {
    console.log('Server open at http://localhost:3000');
});