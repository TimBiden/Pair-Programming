// WS Server code.
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
});

const messages = [
  'You\'re connected.',
  'Now get to work!',
];

wss.on('connection', (ws) => {
  // Sends entire history to all new session participants
  for (let message of messages) {
    ws.send(message);
  }

  ws.on('message', (data) => {
    // Capture data sent to server
    messages.push(data);

    // Broascast to everyone else... Not original sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
