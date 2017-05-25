// WS & Web Server & DB Connection code.

// Requirements
const WebSocket = require('ws');
const mongoose = require('mongoose');
const http = require('http');
const sessionFile = require('./session.js');
const configFile = require('./config.js');

// Variables
// Set WS port
let dbConfig;
const PORT = process.env.PORT || 5000;
console.log(`Port = ${PORT}`);
// Set Web Server Variables
const messages = ['Enter your code here...'];

// Set DB Config Variables
if (PORT === 5000) {
  // For local use only
  dbConfig = process.env.DATABASE_URI
} else {
  dbConfig = process.env.MONGODB_URI;
}

// Create HTTP Server
const server = http.createServer((req, res) => {
  // This doesn't run.
  console.log(`req = ${req}`);
  console.log(`The URL reqed is ${req.url}.`);
  console.log(`res = ${res}`);
});

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

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

const Editor = mongoose.model('Editor', editorSchema);
// Delete after configuring session IDs
const sessionID = sessionFile.sessionID();
const textareaToDB = 'Test string data. Nothing more, nothing less.';
// End deletion after configuring session IDs

const editorInstance = new Editor({
  session: sessionID,
  codeBox: textareaToDB,
});

/**
 * Error checking
 * @param {string} error What's the error?
 * @param {string} model What's the model?
 * @returns {void} Assuming there's no error.
 */
function onEditorSave(error, model) {
  if (error) {
    return console.error(error);
  }
  console.log(model);
}

editorInstance.save(onEditorSave);

let timerSend;

/**
 * Check time since other user updated document.
 * If > 30 seconds, update database with current textarea.
 * @param {string} data Complete text in textarea.
 * @returns {void}
 */
function sendTextarea(data) {
  clearTimeout(timerSend);
  timerSend = setTimeout(() => {
    // textareaToDB(data);
    console.log(`sending data to db ${data}`);
    editorInstance.codeBox = data;
    editorInstance.save(onEditorSave);
  }, 2000);
}

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
    sendTextarea(data);
    console.log(data);

    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
        sendTextarea(data);
      }
    });
  });
});
