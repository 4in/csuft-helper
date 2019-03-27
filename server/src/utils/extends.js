String.prototype.getMiddleText = function (start, end) {
  let a = this.indexOf(start);
  if (a === -1) return '';
  let b = this.indexOf(end, a + 1);
  if (b === -1) return '';
  return this.substr(a + start.length, b - a - start.length);
};