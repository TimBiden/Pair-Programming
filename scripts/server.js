const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.send('something');
});

window.onload = function() {
  // Get references to elements on page.
  const form = document.getElementById('message-form');
  const messageField = document.getElementById('message');
  const messagesList = document.getElementById('messages');
  const socketStatus = document.getElementById('status');
  const closeButton = document.getElementById('close');

  // Save for later code
}
