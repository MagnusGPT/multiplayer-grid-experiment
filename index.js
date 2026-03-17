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

let world = {
    grid: Array.from({ length: 50 }, () => Array(50).fill(0)), //initial array
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
        x: 0,
        y: 0,
        color: getRandomColor()
    }

    let currentPos = [...initialPos];
    while(true) {
        if(world.grid[currentPos[1]][currentPos[0]] === 0) {
            world.users[socket.id].x = currentPos[0];
            world.users[socket.id].y = currentPos[1];
            break;
        }
        else{
            // Note to change here later vvvvvv
            currentPos[0]++;
        }
    }

    socket.on('playerRight', ()=>{
        if (world.users[socket.id].x < 49 && world.grid[world.users[socket.id].y][world.users[socket.id].x + 1] === 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].x++;
        }
    });

    socket.on('playerLeft', ()=>{
        if (world.users[socket.id].x > 0 && world.grid[world.users[socket.id].y][world.users[socket.id].x - 1] === 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].x--;
        }
    });

    socket.on('playerUp', ()=>{
        if (world.users[socket.id].y < 49 && world.grid[world.users[socket.id].y + 1][world.users[socket.id].x] === 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].y++;
        }
    });

    socket.on('playerDown', ()=>{
        if (world.users[socket.id].y > 0 && world.grid[world.users[socket.id].y - 1][world.users[socket.id].x] === 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].y--;
        }
    });

    socket.on('disconnect', () => {
        world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
        delete world.users[socket.id];
        console.log(socket.id, 'disconnected.');
    });
});

function setPlayerPositions() {
    if (world.users.length !== 0) {
        for (let users in world.users) {
            world.grid[world.users[users].y][world.users[users].x] = world.users[users];
        }
    }
}

setInterval(() => {
    worldTick++;
    setPlayerPositions();
    io.emit("tick", worldTick);
    io.emit("updateWorld", world);
}, 50);

server.listen(3000, () => {
    console.log('Server open at http://localhost:3000');
});