export interface BasicContour {
  zValue: number;
  lines: number[];
}

export class BasicContourDrawer {
  private contour: BasicContour[];
  private swapAxes: boolean;

  constructor(levels: number[], swapAxes: boolean) {
    this.contour = new Array(levels.length);
    for (let i = 0; i < levels.length; i++) {
      this.contour[i] = {
        zValue: levels[i],
        lines: [],
      };
    }
    this.swapAxes = swapAxes;
  }

  drawContour(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z: number,
    k: number,
  ) {
    if (!this.swapAxes) {
      this.contour[k].lines.push(y1, x1, y2, x2);
    } else {
      this.contour[k].lines.push(x1, y1, x2, y2);
    }
  }

  getContour() {
    return this.contour;
  }
}
