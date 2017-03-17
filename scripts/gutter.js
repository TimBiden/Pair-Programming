let totalLines = 1;

//
// Doesn't work!!!
//
// Update the numbers in the side gutter.
//
function updateGutter(allLines) {
  // console.log(allLines);
  for (let i = 0; i < allLines; i += 1) {
    const element = document.getElementsByTagName('code')[0];
    element.innerHTML = `${allLines}.`;
  }
}

//
// If the current # of lines = previous # of lines, do nothing.
// Else, run lineNumbers.
//
function unEqual(linesTotal) {
  if (linesTotal !== totalLines) {
    totalLines = linesTotal;
    updateGutter(totalLines);
  }
}

//
// Get the length of the text box.
//
const getLength = function getLength(element) {
  const linesTotal = element.querySelectorAll('div').length + 1;
  unEqual(linesTotal);
};

//
// Listen for Keyup to run getLength function.
//
const box = document.querySelector('.textBox');
box.addEventListener('keyup', function() {
  getLength(box);
});
