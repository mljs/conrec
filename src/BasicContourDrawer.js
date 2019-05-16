export class BasicContourDrawer {
  constructor(levels) {
    this.contour = new Array(levels.length);
    for (var i = 0; i < levels.length; i++) {
      this.contour[i] = {
        zValue: levels[i],
        lines: []
      };
    }
  }

  drawContour(x1, y1, x2, y2, z, k) {
    this.contour[k].lines.push(x1, y1, x2, y2);
  }

  getContour() {
    return this.contour;
  }
}
