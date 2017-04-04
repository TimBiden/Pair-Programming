/**
 * Adds two numbers together.
 * @returns {void}
 */
function saveText() {
  const textToSave = document.getElementById('mainTextArea').value;
  const textToSaveAsBlob = new Blob([textToSave], {
    type: 'text/plain'
  });
  const fileName = document.getElementById('inputFileName').value;
}

saveText();
