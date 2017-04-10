/**
 * Save text in fileNameTextBox as a text file.
 * File name and extension are set by user.
 * @returns {void}
 */
function saveTextAsFile() {
  const textToSave = document.getElementById('mainTextArea').value;
  const textToSaveAsBlob = new Blob([textToSave], {
    type: 'text/plain'
  });
  const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  const fileNameToSaveAs = document.getElementById('fileNameTextBox').value;

  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  downloadLink.href = textToSaveAsURL;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

/**
 * Load text from file to edit.
 * @returns {void}
 */
function loadFile() {
  const fileToLoad = document.getElementById('fileToLoad').files[0];
  const fileReader = new FileReader();

// Check if file is specified
  if (fileToLoad === undefined) {
    alert('Please select a file to load.');
  } else {
    // Check for confirmation of overwriting existing content
    if (confirm('Do you want to overwrite current file?')) {
      fileReader.onload = function readFile(fileLoadedEvent) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById('mainTextArea').value = textFromFileLoaded;
      };
      fileReader.readAsText(fileToLoad, 'UTF-8');
      document.getElementById('fileToLoad').value = '';
    }
  }
}
