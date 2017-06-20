// WS & Web Server & DB Connection code.

// Requirements
const configFile = require('./config.js');
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const sessionFile = require('./session.js');
const WebSocket = require('ws');

// Variables
// Set WS port
const webSocketPort = process.env.WSPORT;
// const webSocketPort = 8000;

// Database address
const dbConfig = process.env.MONGODB_URI;

// Set Web Server Variables
const httpPort = process.env.PORT;
const messages = ['Enter your code here...'];
let filePath = '';

//
// Create HTTP Server
//
const handler = (request, response) => {

  filePath = (`${request.url}`);
  if (filePath === '/') {
    filePath = 'index.html';
  } else if (filePath === '/ws-port') {
    filePath = '/frontend/ws-port.js';
  }

  console.log(' ');
  console.log(`filePath = ${filePath}`);

  const contentTypesByExtention = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/icon',
  };

  const extname = path.extname(filePath);
  const contentType = contentTypesByExtention[extname] || 'text/plain';

  filePath = path.join(__dirname, '..', filePath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(content, 'utf-8');
    }
  });
};

const server = http.createServer(handler);

server.listen(httpPort, (err) => {
  if (err) {
    return console.log('ERROR OPERATOR:', err);
  }
  console.log(`Web Server is listening on ${httpPort}`);
});

//
// Database connection
//
mongoose.Promise = require('bluebird');

mongoose.connect(dbConfig);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected.');
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

//
// WebSocket connection
//
const wss = new WebSocket.Server({
  port: webSocketPort,
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
