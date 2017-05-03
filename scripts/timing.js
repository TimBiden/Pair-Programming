let timer;
reBlock();

/**
 * Unblock text editor for recipient
 * @returns {void}
 */
function unBlock() {
  document.getElementById('mainTextArea').disabled = false;
}

/**
 * Reblock text editor for recipient
 * @returns {void}
 */
function reBlock() {
  document.getElementById('mainTextArea').disabled = true;
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
