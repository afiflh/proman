function* generatePadNumber(subtasklistLength) {
  let nextCode = subtasklistLength + 1;
  return nextCode.toString().padStart(2, "0");
}

module.exports = generatePadNumber;