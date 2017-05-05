// WS Server code.
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;

const wss = new WebSocket.Server({
  port: PORT,
});

const messages = ['Enter your code here...'];

wss.on('connection', (ws) => {
  // Send the existing message history to all new connections that join.
  for (const message of messages) {
    ws.send(message);
  }

  ws.on('message', (data) => {
    // Capture the data we received.
    messages.push(data);

    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
