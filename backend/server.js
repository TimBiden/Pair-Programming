// WS & Web Server & DB Connection code.

// Requirements
const configFile = require('./config.js');
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const sessionFile = require('./session.js');
const WebSocket = require('ws');

// Variables
// Set WS port
let dbConfig;
const webSocketPort = process.env.PORT || 5000;
console.log(`Web Socket Port = ${webSocketPort}`);

// Set Web Server Variables
const httpPort = 3000;
console.log(`Web Server Port = ${httpPort}`);
const messages = ['Enter your code here...'];

// Set DB Config Variables
// Local or production check
if (webSocketPort === 5000) {
  // For local use only
  dbConfig = process.env.DATABASE_URI
} else {
  dbConfig = process.env.MONGODB_URI;
}

// Create HTTP Server
const requestHandler = (request, response) => {
  console.log(request.url);

  // Least staticky option.
  const matchedSessionId = request.url.match(/\/s\/([A-Za-z0-9]+)/);

  if (matchedSessionId) {
    const sessionId = matchedSessionId[1];

    console.log(sessionId);
    console.log('ATTEMPTING TO LOAD SESSION:', sessionId);

    fs.readFile('../index.html', (err, data) => {
      // response.write('Say something witty, you chipper bastard!');
      response.write(data);
      response.end();
    });
  } else {
    // A bit less static option.
    // if (request.url.substr(0, 3) === '/s/') {
    //     response.end('Ohaaaaaaay, ' + request.url.substr(3));
    // }

    // Super static option, good for static URLs.
    switch (request.url) {
      case '/':
        response.write('WELCOME HOME');
        response.end();
        break;

      default:
        response.end('Not using first option!');
    }
  }
};

const server = http.createServer(requestHandler);

server.listen(httpPort, (err) => {
  if (err) {
    return console.log('ERROR OPERATOR:', err);
  }
  console.log(`Server is listening on ${httpPort}`);
});

//
// Database connection
//
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
