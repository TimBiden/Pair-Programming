// WS & Web Server & DB Connection code.

// Requirements
const WebSocket = require('ws');
const mongoose = require('mongoose');
const configFile = require('./config.js');
const sessionFile = require('./session.js');
const textareaFile = require('../frontend/textarea.js');

// Variables
// Set WS port
const PORT = process.env.PORT || 5000;
// Set Web Server Variables
const messages = ['Enter your code here...'];
// Set DB Config Variables
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

const Editor = mongoose.model('Editor', editorSchema);
// Delete after configuring session IDs
const sessionID = sessionFile.sessionID();
const textareaToDB = 'yada yada freakin\' yada.';
// const textareaToDB = textareaFile.textareaToDB(); // Check this line. Still crash server?
// End deletion after configuring session IDs

const editorInstance = new Editor({
  session: sessionID,
  codeBox: textareaToDB,
});
console.log(`The sessionID is ${sessionID}.`);

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
    textareaToDB(data);
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

    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
