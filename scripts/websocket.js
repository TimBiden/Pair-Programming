//
// Code from http://blog.teamtreehouse.com/an-introduction-to-websockets
//
window.onload = function() {
  // Get references to elements on page.
  // const form = document.getElementById('message-form');
  const messageField = document.getElementById('mainTextArea');

  // Create new WebSocket
  const socket = new WebSocket('ws://localhost:8080');

  // Receive messages
  socket.onmessage = function(event) {
    const message = event.data;

    // Print message value to all textarea boxes in session
    document.getElementById('mainTextArea').value = message;
    resizeTextBox();
  };

  // Making magic happen!!!
  messageField.addEventListener('keyup', () => {
    console.log('it works!!!');
    // retrieve data from textarea
    const message = messageField.value;

    // Send message data through websocket
    socket.send(message);
    getLines();
  });

  // Run resize function
  resizeTextBox();
};
