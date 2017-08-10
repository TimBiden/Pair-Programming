let timerMessage;
let timerSend;

/**
 * Unblock text editor for recipient
 * @returns {void}
 */
function unBlock() {
  document.getElementById('mainTextArea').disabled = false;
}

/**
 * Sends message that the user is free to code
 * @returns {void}
 */
function unBlockMessage() {
  const warnText = '<div class="alert alert-info" role="alert"><strong>Hi there!</strong ><br>You are now free to pair program with people around the planet. <br>Sorry. I can\'t afford interplanetary hosting yet. Care to donate?';

  document.getElementById('CodingMessage').innerHTML = warnText;
}

/**
 * Reblock text editor for recipient
 * @returns {void}
 */
function reBlock() {
  document.getElementById('mainTextArea').disabled = true;
}

/**
 * Shows message that another person is coding.
 * @returns {void}
 */
function blockMessage() {
  const alertMessage = '<div class="alert alert-info" role="alert"><strong>Heads up!</strong><br>Someone else is currently coding.<br>Please extinguish your hyperdrive and wait your turn.<br>You can continue on your voyage as soon as they completed their jump to Hyperspace.</div>';

  document.getElementById('CodingMessage').innerHTML = alertMessage;
}

/**
 * Check time since other user updated document.
 * If > 1.5 seconds, release textarea for editing.
 * @returns {void}
 */
function checkTime() {
  clearTimeout(timerMessage);
  reBlock();
  blockMessage();
  timerMessage = setTimeout(() => {
    unBlock();
    unBlockMessage();
  }, 1500);
}
