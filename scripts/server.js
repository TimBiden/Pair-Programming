// WS Server code.

// Requirements
const WebSocket = require('ws');
const mongoose = require('mongoose');

// Variables
const messages = ['Enter your code here...'];

// Database connection
const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://Terpenoid:warnText.fontcolor@ds131511.mlab.com:31511/heroku_m2vw9mgp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('We\'re connected. I think.');
});

// WebSocket connection
const wss = new WebSocket.Server({
  port: PORT,
});

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
