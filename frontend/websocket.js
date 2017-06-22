/**
 * Connect via websocket
 * @param {number} response Current ws port number
 * @returns {void}
 */
// Get references to elements on page.
const messageField = document.getElementById('mainTextArea');

//
// Create new WebSocket on Heroku
//
const server = window.location.origin.replace(window.location.protocol, 'ws:');

const socket = new WebSocket(server);

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
