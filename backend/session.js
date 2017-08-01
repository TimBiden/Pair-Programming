// session.js
//
// Produce randomized session ID

// Randomize ID length
const genIDLength = Math.floor(Math.random() * (9 - 5)) + 5;
// Possible characters for use in ID.
const possibleChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generate session ID
exports.sessionID = function sessionID() {
  // Greate new blank string variable.
  let genID = '';
  for (let i = 0; i < genIDLength; i += 1) {
    // Pick char from possibleChar
    genID += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
  }

  // Tests output of generated ID
  console.log(`sessionID from session.js = ${genID}`);

  // Returns genID value to sessionID export variable.
  return genID;
};
