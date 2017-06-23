// WS & Web Server & DB Connection code.

// Requirements
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const sessionFile = require('./session.js');
const url = require('url');
const WebSocket = require('ws');

// Variables
// Set WS port
const webSocketPort = 5000;

// Database Variables
const dbConfig = 'mongodb://127.0.0.1:27017/newTest';
let sessionIdString;

// Set Web Server Variables
// Choose localServer or digitalOcean
const digitalOcean = 80;
const localServer = 5000;
const httpPort = localServer;
const messages = ['Enter your code here...'];
let filePath = '';

//
// Create HTTP Server
//
const handler = (request, response) => {
  filePath = (`${request.url}`);

  console.log(' ');

  if (filePath === '/') {
    filePath = 'index.html';
  }

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
      // response.writeHead(404);
      // console.log(`The error is ${error}`);
      // sessionIdString = request.url;
      sessionIdString = request.url.substr(1);
      console.log(`The requested Session ID is ${sessionIdString}`);

      // Get specific session...
      Editor.find({
        session: sessionIdString,
      }, (err, session) => {
        if (err) throw err;

        console.log(session);
      });

      console.log(`response = ${response.statusCode}`);
      response.end(content, 'utf-8');
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      console.log(`response = ${response.statusCode}`);
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
  created_at: Date,
  updated_at: Date,
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
 * If > 2 seconds, update database with current textarea.
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
  server: server,
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
