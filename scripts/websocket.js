// Get references to elements on page.
const messageField = document.getElementById('mainTextArea');
// Create new WebSocket
const socket = new WebSocket('ws://sleepy-ridge-88571.herokuapp.com');

window.onload = function() {
  // Receive messages
  socket.onmessage = function(event) {
    const message = event.data;

    // Print message value to all textarea boxes in session
    document.getElementById('mainTextArea').value = message;
    resizeTextBox();
    getLines();
  };

  // Making magic happen!!!
  messageField.addEventListener('keyup', () => {
    sendData();
    getLines();
  });

  // Run numbering function
  getLines();
};

function sendData() {
  // retrieve data from textarea
  const message = messageField.value;

  // Send message data through websocket
  socket.send(message);
}
