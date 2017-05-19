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
  console.log(`sessionID = ${genID}`);
  return genID;
};

sessionID();

// //
// // Parse URL
// //
//
// // Get full URL
// const newURL = window.location.protocol + '//' + window.location.host + '/' + window.location.pathname;
// console.log(newURL);
//
// // Break up the pathname, split string on "/" characters
// const pathArray = window.location.pathname.split('/');
//
// // Then access parts of the array
// const secondLevelLocation1 = pathArray[0];
// const secondLevelLocation2 = pathArray[1];
// const secondLevelLocation3 = pathArray[2];
// const secondLevelLocation4 = pathArray[3];
//
// console.log(`secondLevelLocation1 = ${secondLevelLocation1}`);
// console.log(`secondLevelLocation2 = ${secondLevelLocation2}`);
// console.log(`secondLevelLocation3 = ${secondLevelLocation3}`);
// console.log(`secondLevelLocation4 = ${secondLevelLocation4}`);
//
// // Reassemble URL, with /'s included
// let newPathname = '';
// for (let i = 0; i < pathArray.length; i += 1) {
//   newPathname += '/';
//   newPathname += pathArray[i];
// }
