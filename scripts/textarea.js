let getLinestimesRun = 0;
let updateGuttertimesRun = 0;

/**
 * Update the numbers in the side gutter.
 * @param {number} allLines total number of lines in the editor.
 * @returns {int} The width of textBox div.
 * Calls {none}
 * Called by {unEqual}
 **/
function updateGutter(allLines) {
  updateGuttertimesRun += 1;
  const toAdd = document.createDocumentFragment();
  document.getElementsByClassName('gutter')[0].innerHTML = '';

  for (let i = 1; i < allLines; i += 1) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `${i}.`;
    toAdd.appendChild(newDiv);
    document.getElementsByClassName('gutter')[0].appendChild(toAdd);
  }
}

function getLines() {
  getLinestimesRun += 1;
  const box = document.querySelector('#mainTextArea');
  const lineCount = ((box.value.split(/\n/g).length) + 1);
  updateGutter(lineCount);
}

let observe;

if (window.attachEvent) {
  observe = function observeFunctionMain(element, event, handler) {
    element.attachEvent('on' + event, handler);
  };
} else {
  observe = function observeFunctionElse(element, event, handler) {
    element.addEventListener(event, handler, false);
  };
}

function resizeTextBox() {
  var text = document.getElementById('mainTextArea');

  function resize() {
    text.style.height = 'auto';
    text.style.height = (text.scrollHeight + 20) + 'px';
  }
  /* 0-timeout to get the already changed text */
  function delayedResize() {
    window.setTimeout(resize, 0);
  }
  observe(text, 'change', resize);
  observe(text, 'cut', delayedResize);
  observe(text, 'paste', delayedResize);
  observe(text, 'drop', delayedResize);
  observe(text, 'keydown', delayedResize);

  text.focus();
  text.select();
  resize();
}
