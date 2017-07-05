// WS & Web Server & DB Connection code.

// Requirements
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const sessionFile = require('./session.js');
// const url = require('url');
const WebSocket = require('ws');

//
// Variables
//
// Websocket Variables
const webSocketPort = 5000;
let textBackToEditor;

// Database Variables
const dbConfig = 'mongodb://127.0.0.1:27017/newTest';
let sessionIdString;

// Web Server Variables
// Choose localServer or digitalOcean
const digitalOcean = 80;
const localServer = 5000;
const httpPort = localServer;
// Standard Web Server Variables
let messages = ['Enter your code here...'];
let filePath = '';

//
// Configure HTTP Server
//
const httpServerConfig = (request, response) => {
  filePath = (`${request.url}`);
  sessionIdString = request.url.substr(1);

  function checkURL() {
    // load index.mthl when no session ID attached
    if (filePath === '/') {
      filePath = 'index.html';
    } else if (sessionIdString !== 'style/style.css' && sessionIdString !== 'frontend/textarea.js' && sessionIdString !== 'frontend/textsave.js' && sessionIdString !== 'frontend/timing.js' && sessionIdString !== 'frontend/websocket.js' && sessionIdString !== 'robots.txt' && sessionIdString !== 'favicon.ico') {
      filePath = 'index.html';
      queryDB();
    }
  }

  function queryDB() {
    // Query DB by session ID
    Editor.findOne({
      session: sessionIdString,
    }, (err, sessionData) => {
      if (err) throw err;

      checkForSessionData(sessionData);
    });
  }

  /**
   * Check for existing session data
   * @param {string} dbResults Is the specified session ID valid?
   * @returns {dbResults.codeBox} Text to send back to editor.
   */
  const checkForSessionData = function checkForSessionData(dbResults) {
    // If there's session data, get the existing code from the DB.
    if (queryDB) {
      const textToEditor = dbResults.codeBox;
      filePath = '/';
      checkURL();
    }
    textBackToEditor = dbResults.codeBox;
  }

  function pageRender() {
    // Start checking URL for session IDs or valid pages
    fs.readFile(filePath, (error, content) => {
      if (error) {
        // http responses
        response.writeHead(404);
        response.end(content, 'utf-8');
      } else {
        // If the file exists, load that file
        response.writeHead(200, {
          'Content-Type': contentType,
        });
        response.end(content, 'utf-8');
      }
    });
  }

  checkURL();

  // Types of files to pass
  const contentTypesByExtention = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/icon',
    '.txt': 'text/plain',
  };

  // Pass the files correctly
  const extname = path.extname(filePath);
  const contentType = contentTypesByExtention[extname] || 'text/plain';

  filePath = path.join(__dirname, '..', filePath);
  pageRender();
};

// Create http server
// Run file checks created in server config
const server = http.createServer(httpServerConfig);

// Start Server
server.listen(httpPort, (err) => {
  if (err) {
    return console.log('ERROR OPERATOR:', err);
  }
});

//
// Database connection
//
mongoose.Promise = require('bluebird');

mongoose.connect(dbConfig);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
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
  return model;
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

  if (textBackToEditor) {
    ws.send(textBackToEditor)
    messages = ['Enter your code here...'];
  } else {
    for (const message of messages) {
      ws.send(message);
    }
  }

  ws.on('message', (data) => {
    // Capture the data we received.
    messages.push(data);
    sendTextarea(data);

    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      if (client != ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
        sendTextarea(data);
      }
    });
  });
});
