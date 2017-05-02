let timer;

/**
 * Check time since other user updated document.
 * If > 1.5 seconds, release textarea for editing.
 * @param {number} arg total number of lines in the editor.
 * @returns {void}
 */
function checkTime() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log('Time\'s up.');
    // validate(arg);
  }, 1500);
}
