const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

let world = {
    grid: Array.from({ length: 50 }, () => Array(50).fill(0)), //initial array
    users: {}
}
let worldTick = 0;


app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

io.on('connection', (socket) => {
    console.log(socket.id, 'connected.');
    world.users[socket.id] = {
        x: 25,
        y: 25
    }

    socket.on('playerRight', ()=>{
        if (world.users[socket.id].x < 50) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].x++;
        }
    });

    socket.on('playerLeft', ()=>{
        if (world.users[socket.id].x > 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].x--;
        }
    });

    socket.on('playerUp', ()=>{
        if (world.users[socket.id].y < 50) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].y++;
        }
    });

    socket.on('playerDown', ()=>{
        if (world.users[socket.id].y > 0) {
            world.grid[world.users[socket.id].y][world.users[socket.id].x] = 0;
            world.users[socket.id].y--;
        }
    });
});

function setPlayerPositions() {
    if (world.users.length !== 0) {
        for (let users in world.users) {
            world.grid[world.users[users].y][world.users[users].x] = users;
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