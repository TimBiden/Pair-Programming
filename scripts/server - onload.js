//
// WS Server code.
//

const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
});

// Begin regular functions

/**
 * Starts the WS server.
 * @returns {void}
 * Called by {window.onload}
 */
function startServer() {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.send('something');
  });
}

// Call functions on load
window.onload = function loadFunctions() {
  startServer();
};
