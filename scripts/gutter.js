let totalLines = 1;

function updateGutter(allLines) {
  // console.log(allLines);
  const element = document.getElementsByClassName('gutter')[0];
  element.innerHTML = allLines;
}

const lineNumbers = function lineNumbers(lines) {
  let allLines = '';
  for (let i = 1; i < lines; i += 1) {
    allLines = `${allLines}\n ${i}.`;
  }
  updateGutter(allLines);
};

function unEqual(linesTotal) {
  if (linesTotal !== totalLines){
    totalLines = linesTotal;
    lineNumbers(totalLines);
  }
}

const getLength = function getLength(element) {
  const linesTotal = element.querySelectorAll('div').length + 1;
  unEqual(linesTotal);
};

const box = document.querySelector('.textBox');
box.addEventListener('keyup', function () {
  getLength(box);
});
