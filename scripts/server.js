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
    socketStatus.innerHTML = `Connected to: ${event.currentTarget.URL}`;
    socketStatus.classname = 'open';
  };

  // Error Handling
  socket.onerror = function(error) {
    console.log(`WebSocket error: ${error}`);
  };

  // Send a message.
  form.onsubmit = function(e) {
    e.preventDefault();

    // retrieve message from textarea
    const message = messageField.value;

    // Send message through websocket
    socket.send(message);

    // add message to messagesList
    messagesList.innerHTML += `<li class="sent"><span>Sent:</span>${message}</li>`;

    // clear out message field
    messageField.value = '';

    return false;
  };

  // Receive messages
  socket.onmessage = function(event) {
    const message = event.data;
    messagesList.innerHTML += `<li class="received"><span>Received:</span> ${message} </li>`
  };

  // Closing connections
  closeButton.onclick = function(e) {
    e.preventDefault();

    // Close the WebSocket
    socket.close();

    return false;
  };

  // Closing Message
  socket.onclose = function(event) {
    socketStatus.innerHTML = 'Disconnected from WebSocket server.';
    socketStatus.classname = 'closed';
  };
};
