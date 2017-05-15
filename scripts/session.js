// Variables

// Randomize ID length
const genIDLength = Math.floor(Math.random() * (9 - 5)) + 5;
const possibleChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generate session ID
const sessionID = function sessionID() {
  let genID = '';
  for (let i = 0; i < genIDLength; i += 1) {
    // Pick char from possibleChar
    genID += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
  }
  return genID;
};

sessionID();
