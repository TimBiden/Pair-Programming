let timer;

/**
 * Unblock text editor for recipient
 * @returns {void}
 */
function unBlock() {
  const warnText = 'You are now free to pair program with people around the planet. <br>Sorry. I can\'t afford interplanetary hosting yet. Care to donate?';

  document.getElementById('mainTextArea').disabled = false;
  document.getElementById('CodingMessage').innerHTML = warnText;
}

/**
 * Reblock text editor for recipient
 * @returns {void}
 */
function reBlock() {
  const warnText = 'Someone else is currently coding.<br>Please extinguish your hyperdrive and wait your turn.';
  const warnBlock = warnText.fontcolor('red');

  document.getElementById('mainTextArea').disabled = true;
  document.getElementById('CodingMessage').innerHTML = warnBlock;
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
