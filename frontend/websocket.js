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

  // Send message data through websocket
  socket.send(message);
}

/**
 * Send and receive message data through websocket
 * @returns {void}
 */
window.onload = () => {
  // Receive messages
  messages = [];
  socket.onmessage = (event) => {

    // Bug chasing
    console.log(event); // Object data
    console.log(event.data); // String data "Enter your code here..."
    console.log(typeof event); // Object
    console.log(typeof event.data); // String
    console.log(JSON.parse(event.data));
    const message = JSON.parse(event.data);

    messages.push(message);

    console.log('====================================');
    console.log('message', message);
    console.log('messages', messages);

    if (message.type === 'SESSION_ID') {
      feSessionID = message.data.sessionID;
      console.log(`feSessionID = ${feSessionID}`);
      urlChange();
    }

    // Print message value to all textarea boxes in session
    document.getElementById('mainTextArea').value = messages[0];
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

function urlChange() {
  console.log(`timing - feSessionID = ${feSessionID}`);
  history.pushState(null, null, feSessionID);
}
