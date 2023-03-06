const io = require('socket.io')();
const http = require('http');
const server = http.createServer((req, res) => {
    // handle HTTP requests if needed
});
const port = 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
io.attach(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
