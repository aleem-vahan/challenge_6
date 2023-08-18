const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();

app.use(cors());

const server = http.createServer(app);
const sio = require('socket.io');

// enable cors

// serve static files
app.use(express.static('public'));

// socket.io code
const io = sio(server, {
    pingInterval: 1000, // 1 seconds
    pingTimeout: 1000,
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("hiii")
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

// start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
