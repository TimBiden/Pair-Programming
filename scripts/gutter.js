let totalLines = 1;

const lineNumbers = function lineNumbers(lines) {
  let allLines = '';
  for (let i = 1; i < lines; i += 1) {
    allLines = `${allLines}\n ${i}.`;
  }
  console.log(allLines);
};

let unEqual = function unEqual(linesTotal) {
  if (linesTotal !== totalLines){
    totalLines = linesTotal;
    lineNumbers(totalLines);
  }
}

const getLength = function getLength(element) {
  const linesTotal = element.querySelectorAll('div').length + 1;
  unEqual(linesTotal);
  // lineNumbers(linesTotal);
};

const box = document.querySelector('.textBox');
box.addEventListener('keyup', function () {
  getLength(box);
});
