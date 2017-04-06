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
