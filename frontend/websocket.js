// Get references to elements on page.
const messageField = document.getElementById('mainTextArea');

// Create new WebSocket on Heroku

// const server = 'ws://sleepy-ridge-88571.herokuapp.com';
// const server = 'wss://sleepy-ridge-88571.herokuapp.com';
// const server = 'ws://sleepy-ridge-88571.herokuapp.com:8080';
// const server = 'wss://sleepy-ridge-88571.herokuapp.com:8080';
const server = location.origin.replace(/^http/, 'ws');
// const server = location.origin.replace(/^http/, 'wss');
// const server = location.origin.replace(/^https/, 'ws');
// const server = location.origin.replace(/^https/, 'wss');

const socket = new WebSocket(server);
// Local config file
// const socket = new WebSocket('ws://localhost:8080');

/**
 * Retrieve data from textarea
 * Send message data through websocket
 * @returns {void}
 */
function sendData() {
  // retrieve data from textarea
  const message = messageField.value;

  // Send message data through websocket
  socket.send(message);
}

/**
 * Send and receive message data through websocket
 * @returns {void}
 */
window.onload = () => {
  // Receive messages
  socket.onmessage = (event) => {
    const message = event.data;

    // Print message value to all textarea boxes in session
    document.getElementById('mainTextArea').value = message;
    resizeTextBox();
    getLines();
    checkTime();
  };

  // Making magic happen!!!
  messageField.addEventListener('keyup', () => {
    sendData();
    getLines();
  });

  // Run numbering function
  getLines();
};
