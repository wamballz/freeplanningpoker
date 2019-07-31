const io = require('socket.io')();

io.on('connection', (client) => {
    console.log('New Connection');
    client.on('socketInit', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);