// global Variables
let feSessionID;

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

  const payload = {
    SESSION_ID: feSessionID,
    MESSAGES: message,
  };

  // Send message data through websocket
  socket.send(JSON.stringify(payload));
}

/**
 * Send new session ID to location bar.
 * @returns {void}
 */
function urlChange() {
  // console.log(`timing - feSessionID = ${feSessionID}`);
  history.pushState(null, null, feSessionID);
}

/**
 * Send and receive message data through websocket
 * @returns {void}
 */
window.onload = () => {
  // Receive messages
  const messages = [];
  socket.onmessage = (event) => {
    // console.log(JSON.stringify(event.data));
    // console.log(typeof JSON.stringify(event.data));
    const message = JSON.parse(event.data);

    // console.log(message);

    messages.push(message.MESSAGES);

    // console.log('====================================');
    // console.log('message', message);

    if (message.SESSION_ID) {
      feSessionID = message.SESSION_ID;
      // console.log(`feSessionID = ${feSessionID}`);
      urlChange();
    }

    // Print message value to all textarea boxes in session
    document.getElementById('mainTextArea').value = message.MESSAGES;
    resizeTextBox(); // Definned in other file.
    getLines(); // Definned in other file.
    checkTime(); // Definned in other file.
  };

  // Making magic happen!!!
  messageField.addEventListener('keyup', () => {
    sendData();
    getLines(); // Definned in other file.
  });

  // Run numbering function
  getLines(); // Is defined in textarea.js
};
