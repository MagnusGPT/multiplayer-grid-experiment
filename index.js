const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

io.on('connection', (socket) => {
    console.log(socket.id, 'connected.');
});

server.listen(3000, () => {
    console.log('Server open at http://localhost:3000');
});