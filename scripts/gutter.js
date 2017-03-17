let totalLines = 1;

//
// Update the gutter with correct # of lines.
//
function updateGutter(allLines) {
  // console.log(allLines);

  for (let i = 0; i < allLines.length; i += 1) {
    document.getElementsByClassName('gutter').innerHTML = ' ';
    const temp = document.createElement('div');
    temp.innerHTML = allLines[i];
    document.getElementsByClassName('gutter')[0].appendChild(temp);
  }
}

//
// Create array of numbers and `.` to make up gutter.
//
const lineNumbers = function lineNumbers(lines) {
  let allLines = [];
  for (let i = 1; i < lines; i += 1) {
    allLines.push(`${i}.`);
  }
  updateGutter(allLines);
};

//
// If the current # of lines = previous # of lines, do nothing.
// Else, run lineNumbers.
//
function unEqual(linesTotal) {
  if (linesTotal !== totalLines) {
    totalLines = linesTotal;
    lineNumbers(totalLines);
  }
}

//
// Get the length of the text box.
//
const getLength = function getLength(element) {
  const linesTotal = element.querySelectorAll('div').length + 2;
  unEqual(linesTotal);
};

//
// Listen for Keyup to run getLength function.
//
const box = document.querySelector('.textBox');
box.addEventListener('keyup', function() {
  getLength(box);
});
