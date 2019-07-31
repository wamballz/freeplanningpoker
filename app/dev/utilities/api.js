import openSocket from 'socket.io-client';
const  socket = openSocket('http://ec2-13-59-76-90.us-east-2.compute.amazonaws.com:8000');
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function sendMessage(ourMessage) {
  console.log(ourMessage)
  // socket.on('chat message', timestamp => cb(null, timestamp));
  socket.emit('chat message', ourMessage);

  //dispatch(sessionActions.updateMessageArr(ourMessage));
}
function readMessage(ourMessage) {
  console.log(ourMessage)
  socket.on('chat message', (msg) => {
    console.log("poopy" + msg)
    return msg;
    })
}

export { subscribeToTimer, sendMessage, readMessage }