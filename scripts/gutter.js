const lineNumbers = function lineNumbers(lines) {
  let allLines = '';
  for (let i = 1; i < lines; i += 1) {
    allLines = `${allLines}\n ${i}.`;
  }
  console.log(allLines);
};

const getLength = function getLength(element) {
  const linesTotal = element.querySelectorAll('div').length + 1;
  // console.log('getLength = ');
  // console.log(linesTotal);
  lineNumbers(linesTotal);
};

const box = document.querySelector('.textBox');
box.addEventListener('keyup', function() {
  getLength(box);
});
