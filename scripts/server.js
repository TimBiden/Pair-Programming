// WS Server code.

// Requirements
const WebSocket = require('ws');
const mongoose = require('mongoose');

// Variables
const messages = ['Enter your code here...'];

// Database connection
const PORT = process.env.PORT || 5000;
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('We\'re connected. I think.');
});

// Define Mongo schema
const editorSchema = mongoose.Schema({
  session: String,
  codeBox: String,
});

const codeBoxModel = mongoose.model('codeBoxModel', editorSchema);
const sessionIDModel = mongoose.model('sessionIDModel', editorSchema);
// Delete after configuring session IDs
const sessionID = PORT;

let sesh = new sessionIDModel({ session: sessionID });
let textbox = new codeBoxModel({ codeBox: textareaToDB });

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
