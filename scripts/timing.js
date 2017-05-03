let timer;
let toBlockOrNot;

/**
 * Unblock text editor for recipient
 * @returns {void}
 */
function unBlock() {
  console.log('You can type now');
  toBlockOrNot = false; // Delete after unblocking works
}

/**
 * Reblock text editor for recipient
 * @returns {void}
 */
function reBlock() {
  console.log('You are blocked now'); // Delete after blocking works
  toBlockOrNot = true;
}

/**
 * Check time since other user updated document.
 * If > 1.5 seconds, release textarea for editing.
 * @returns {void}
 */
function checkTime() {
  clearTimeout(timer);
  reBlock();
  timer = setTimeout(() => {
    unBlock();
  }, 1500);
}
