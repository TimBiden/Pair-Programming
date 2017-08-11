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

// Web Server Variables
// Choose localServer or digitalOcean
const digitalOcean = 80;
const localServer = 5000;
const httpPort = digitalOcean;

// Standard Web Server Variables
const messages = ['Enter your code here...'];
const clientPool = {};
let sessionIdArray = [];
let filePath = '';
let finalSessionID;
let filePathString;

//
// Web Server Functions
//

/**
 * Set Session ID and file names
 * @param {string} request The URL being requested
 * @returns {dbResults.codeBox} Text to send back to editor.
 */
function setSessionID(request) {
  filePath = (`${request.url}`);
  filePathString = request.url.substr(1);
  sessionIdArray.push(filePathString);
  console.log(`filePathString = ${filePathString}`);

  if (filePathString === 'favicon.ico' || filePathString === 'frontend/timing.js') {
    sessionIdArray = [];
  } else {
    finalSessionID = sessionIdArray[0];
  }

  // Get session ID from session.js
  if (request.url.substr(1) === '') {
    sessionIdArray = [];
    finalSessionID = sessionFile.sessionID();
    sessionIdArray.push(finalSessionID);
  }
}

/**
 * Check URL for Session ID, filename...
 * @returns {void} Text to send back to editor.
 */
function checkURL() {
  // load index.html when no session ID attached
  // Allow necessary files to pass without
  // creating new session IDs.
  if (filePath === '/' || filePath === '') {
    textBackToEditor = 'Enter your code here...';
    newSession();
    filePath = 'index.html';
  } else if (filePathString !== 'about.html' && filePathString !== 'style/style.css' && filePathString !== 'style/bootstrap-custom.css' && filePathString !== 'style/bootstrap.css' && filePathString !== 'frontend/textarea.js' && filePathString !== 'frontend/textsave.js' && filePathString !== 'frontend/timing.js' && filePathString !== 'frontend/websocket.js' && filePathString !== 'robots.txt' && filePathString !== 'favicon.ico' && filePathString !== 'googlece4e0a477119ea08.html') {
    filePath = 'index.html';
    queryDB();
  } else {
    filePath = filePathString;
  }
}

/**
 * Check for existing session data
 * @param {string} dbResults Is the specified session ID valid?
 * @returns {dbResults.codeBox} Text to send back to editor.
 */
const checkForSessionData = function checkForSessionData(dbResults) {
  // If there's session data, get the existing code from the DB.
  if (queryDB) {
    // console.log(`queryDB = ${queryDB}`);
    const textToEditor = dbResults.codeBox;
    filePath = '/';
    checkURL();
  }
  textBackToEditor = dbResults.codeBox;
};

/**
 * Check URL for Session ID, filename...
 * @returns {void} Text to send back to editor.
 */
function queryDB() {
  // Query DB by session ID
  Editor.findOne({
    session: finalSessionID,
  }, (err, sessionData) => {
    if (err) throw err;

    // console.log(`sessionData = ${sessionData}`);

    let altSessionData = sessionData;

    if (!sessionData) {
      altSessionData = 'Enter your code here...';
    }

    checkForSessionData(altSessionData);
  });
}

/**
 * Renders files in page
 * @param {string} response - HTML response codes
 * @param {string} contentType - File type
 * @returns {void}
 */
function pageRender(response, contentType) {
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

//
// Configure HTTP Server
//
// let count = 0;
const httpServerConfig = (request, response) => {
  if (httpPort === 80) {
    response.writeHead(301, {
      Location: 'http://pairprogrammingapp.com'
    });
    response.end();
  }

  setSessionID(request);

  clientPool[finalSessionID] = clientPool[finalSessionID] || [];

  // console.log(' ');
  // console.log(`filePath is ${filePath}`);
  // console.log(`array length = ${sessionIdArray.length}`);

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
  pageRender(response, contentType);
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
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Editor = mongoose.model('Editor', editorSchema);
const textareaToDB = 'Enter your code here...';

function newSession() {
  const editorInstance = new Editor({
    session: finalSessionID,
    codeBox: textareaToDB,
  });

  editorInstance.save((err) => {
    if (err) {
      // console.log(err);
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
        $eq: data.SESSION_ID,
      },
    }, {
      $set: {
        codeBox: data.MESSAGES,
      },
    }, (err, result) => {
      // console.log(result);
      // console.log(data);
      // console.log(' ');
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

// WS Functions
function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  clientPool[finalSessionID].push(ws);

  // Send the existing message history to all new connections that join.

  const response = {
    SESSION_ID: finalSessionID,
    MESSAGES: messages,
  };

  if (textBackToEditor) {
    response.MESSAGES = textBackToEditor;
    ws.send(JSON.stringify(response));
    // console.log(`response.data = ${response.data}`);
    // ws.send(textBackToEditor);
    // messages = ['Enter your code here...'];
  } else {
    ws.send(JSON.stringify(response));
    // for (const message of messages) {
    //   ws.send(message);
    // }
  }

  ws.on('message', (data) => {
    // IMPORTANT: Gotta turn that string of data
    // into an object we can work with.
    const clientPayload = JSON.parse(data);

    // sendTextarea now accepts an object. We needed
    // to give it the session ID, in addition to the
    // textarea content. The front-end now passes
    // an object containing both pieces of data.
    sendTextarea(clientPayload);

    // Broadcast to everyone else.
    clientPool[clientPayload.SESSION_ID].forEach((wsc) => {
      // Don't send to the client who just sent the original message!
      if (wsc !== ws && wsc.readyState === WebSocket.OPEN) {
        wsc.send(JSON.stringify(clientPayload));
        sendTextarea(clientPayload);
      }
    });
  });
});
