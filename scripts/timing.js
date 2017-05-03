let timer;
let toBlockOrNot;
const textEditor = document.getElementById('mainTextArea')

/**
 * Unblock text editor for recipient
 * @returns {void}
 */
function unBlock() {
  console.log('You can select text now');
  document.getElementById('mainTextArea').setAttribute('user-select', 'auto');
}

/**
 * Reblock text editor for recipient
 * @returns {void}
 */
function reBlock() {
  console.log('You are blocked now'); // Delete after blocking works
  document.getElementById('mainTextArea').setAttribute('user-select', 'none');
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
  }, 2000);
}
