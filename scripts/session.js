const sessionIDLength = Math.floor(Math.random() * (9 - 5)) + 5;
console.log(`sessionIDLength = ${sessionIDLength}`);
const possibleChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let sessionID = '';

for (let i = 0; i < sessionIDLength; i += 1) {
  sessionID += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
  console.log(`numChar = ${sessionID}`);
}

console.log(`numChar = ${sessionID}`);
