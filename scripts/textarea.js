window.onload = function() {
  // Listen for Keyup to run getLength function.
  const box = document.querySelector('.textBox');
  box.addEventListener('keyup', function() {
    getLines();
  });

  // Run resize function
  resizeTextBox();
};

function getLines() {
  const box = document.querySelector('#mainTextArea');

  lineCount = ((box.value.split(/\n/g).length) + 1);

  updateGutter(lineCount);
}

/**
 * Update the numbers in the side gutter.
 * @param {number} allLines total number of lines in the editor.
 * @returns {int} The width of textBox div.
 * Calls {none}
 * Called by {unEqual}
 **/
function updateGutter(allLines) {
  const toAdd = document.createDocumentFragment();
  document.getElementsByClassName('gutter')[0].innerHTML = '';

  for (let i = 1; i < allLines; i += 1) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `${i}.`;
    toAdd.appendChild(newDiv);
    document.getElementsByClassName('gutter')[0].appendChild(toAdd);
  }
}

var observe;

if (window.attachEvent) {
  observe = function(element, event, handler) {
    element.attachEvent('on' + event, handler);
  };
} else {
  observe = function(element, event, handler) {
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
