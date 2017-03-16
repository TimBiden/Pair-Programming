/**
 * Gets the number of lines from .textBox
 * @param {element} element - The title of the book.
 * @returns {Integer} Current number of lines in .textBox
 */
function getLength(element) {
  let linesTotal = 0;
  linesTotal = element.querySelectorAll('div').length + 1;
  console.log(linesTotal);
  return linesTotal;
}

const box = document.querySelector('.textBox');
box.addEventListener('keyup', function () {
  getLength(box);
});
