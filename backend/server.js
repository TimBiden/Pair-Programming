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
let sessionID;
let fileID;

// Web Server Variables
// Choose localServer or digitalOcean
const digitalOcean = 80;
const localServer = 5000;
const httpPort = localServer;
// Standard Web Server Variables
let messages = ['Enter your code here...'];
let filePath = '';
let sessionArray = [];

//
// Configure HTTP Server
//
const httpServerConfig = (request, response) => {
  filePath = (`${request.url}`);
  const filePathString = request.url.substr(1);
  sessionArray.push(request.url.substr(1));

  sessionID = sessionArray[0];

  // Get session ID from session.js
  if (sessionID === '') {
    fileID = sessionFile.sessionID();
    sessionID = fileID;
  }

  clientPool[sessionID] = clientPool[sessionID] || [];

  function checkURL() {
    // load index.html when no session ID attached
    if (filePath === '/') {
      newSession();
      filePath = 'index.html';
    } else if (filePathString !== 'style/style.css' && filePathString !== 'frontend/textarea.js' && filePathString !== 'frontend/textsave.js' && filePathString !== 'frontend/timing.js' && filePathString !== 'frontend/websocket.js' && filePathString !== 'robots.txt' && filePathString !== 'favicon.ico') {
      filePath = 'index.html';
      queryDB();
    }
  }

  function queryDB() {
    // Query DB by session ID
    Editor.findOne({
      session: sessionID,
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
db.once('open', () => {});

// Define Mongo schema
const editorSchema = mongoose.Schema({
  session: String,
  codeBox: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
});

const Editor = mongoose.model('Editor', editorSchema);
const textareaToDB = 'Enter your code here...';

function newSession() {
  const editorInstance = new Editor({
    session: fileID,
    codeBox: textareaToDB,
  });

  editorInstance.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Session saved successfully');
    }
  });
}

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

// editorInstance.save(onEditorSave);

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
    // editorInstance.codeBox = data;
    // editorInstance.save(onEditorSave);
    Editor.update({
      session: {
        $eq: sessionID,
      },
    }, {
      $set: {
        codeBox: data,
      },
    }, (err, result) => {
      // console.log(`${sessionID} Updated Successfully.`);
      console.log(result);
      console.log(data);
      console.log(' ');
    });
  }, 2000);
}
let connectionTimer;

/**
 * Check if connection dropped. If > 1 seconds,
 * update database with current textarea and
 * close WebSocket connection.
 * @param {void}
 * @returns {void}
 */
function closeConnection() {
  clearTimeout(connectionTimer);
  connectionTimer = setTimeout(() => {
    wss.clients.forEach((ws) => {
      ws.isAlive = false;
      ws.ping('', false, true);
    });
  });
}

setInterval(() => {
  closeConnection()
}, 1000);

//
// WebSocket connection
//

// WS Constants & Variables
const wss = new WebSocket.Server({
  server: server,
});
let clientPool = {};

// WS Functions
function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  clientPool[sessionID].push(ws);
  // console.log(clientPool[sessionID]);

  // Send the existing message history to all new connections that join.

  if (!sessionID) {
    // console.log(`sessionID = ${sessionID}.`);
  } else {
    messages = 'Enter your code here...';
    console.log('No sessionID.');
  }

  const response = {
    SESSION_ID: sessionID,
    MESSAGES: messages,
  };
  console.log(`response = ${JSON.stringify(response)}`);

  if (textBackToEditor) {
    response.MESSAGES = textBackToEditor;
    ws.send(JSON.stringify(response));
    console.log(`response.data = ${response.data}`);
    // ws.send(textBackToEditor);
    // messages = ['Enter your code here...'];
  } else {
    ws.send(JSON.stringify(response));
    // for (const message of messages) {
    //   ws.send(message);
    // }
  }

  ws.on('message', (data) => {
    // Capture the data we received.
    // messages.push(data);
    // for (let wsc of clientPool[sessionID]) {
    //   wsc.send(data);
    // }

    let clientPayload = {
      MESSAGES: data,
      SESSION_ID: sessionID,
    };
    clientPayload = JSON.stringify(clientPayload);

    sendTextarea(data);

    // Broadcast to everyone else.
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(clientPayload);
        sendTextarea(data);
      }
    });
  });
});
