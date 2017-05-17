// WS & Web Server & DB Connection code.

// Requirements
const WebSocket = require('ws');
const mongoose = require('mongoose');
const configReq = require('./config.js');

// Variables
// Set WS port
const PORT = process.env.PORT || 5000;
// Set Web Server Variables
const messages = ['Enter your code here...'];
const dbConfig = process.env.DATABASE_URI || process.env.MONGODB_URI;

// Database connection
mongoose.connect(dbConfig);
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

let Editor = mongoose.model('Editor', editorSchema);
// Delete after configuring session IDs
const sessionID = PORT;
const textareaToDB = 'Yada, yada, freaking yada...';
// End deletion after configuring session IDs

let editorInstance = new Editor({
  session: sessionID,
  codeBox: textareaToDB,
});

function onEditorSave(error, model) {
  if (error) {
    return console.error(error);
  }
  console.log(model);
}

editorInstance.save(onEditorSave);

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
