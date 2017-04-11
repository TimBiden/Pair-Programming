//
// Original server code from https://github.com/websockets/ws#server-example
//
// const WebSocket = require('ws');
//
// const wss = new WebSocket.Server({
//   port: 8080,
// });
//
// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//   });
//
//   ws.send('something');
// });

window.onload = function() {
  // Get references to elements on page.
  const form = document.getElementById('message-form');
  const messageField = document.getElementById('message');
  const messagesList = document.getElementById('messages');
  const socketStatus = document.getElementById('status');
  const closeButton = document.getElementById('close');

  // Create new WebSocket
  const socket = new WebSocket('ws://echo.websocket.org');

  // Show "Connected." message when websocket opened successfully.
  socket.onopen = function(event) {
    socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
    socketStatus.classname = 'open';
  };

  // Error Handling
  socket.onerror = function(error) {
    console.log(`WebSocket error: ${error}`);
  };
}
