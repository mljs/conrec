import { ConrecLib } from './Conrec';
import { BasicContourDrawer } from './BasicContourDrawer';
import { ShapeContourDrawer } from './ShapeContourDrawer';

const defaultOptions = {
  nbLevels: 10,
  timeout: 0
};

/**
 *
 * @class Conrec
 * @param {number[][]} matrix
 * @param {number[]} [options.xs]
 * @param {number[]} [options.ys]
 */
export class Conrec {
  constructor(matrix, options = {}) {
    this.matrix = matrix;
    this.xLength = matrix.length;
    this.yLength = matrix[0].length;
    this.xs = options.xs ? options.xs : range(0, this.xLength, 1);
    this.ys = options.ys ? options.ys : range(0, this.yLength, 1);
    this.levels = new Map();
    this.hasMinMax = false;
  }

  /**
   *
   * @param {number[]} [options.levels]
   * @param {number} [options.nbLevels=10]
   * @param {string} [options.contourDrawer='basic'] - 'basic' or 'shape'
   * @param {number} [options.timeout=0]
   * @return {any}
   */
  drawContour(options) {
    options = Object.assign({}, defaultOptions, options);

    var levels;
    if (options.levels) {
      levels = options.levels.slice();
    } else {
      this._computeMinMax();
      const interval = (this.max - this.min) / (options.nbLevels - 1);
      levels = range(this.min, this.max + interval, interval);
    }
    levels.sort((a, b) => a - b);

    let contourDrawer = options.contourDrawer || 'basic';
    if (typeof contourDrawer === 'string') {
      if (contourDrawer === 'basic') {
        contourDrawer = new BasicContourDrawer(levels);
      } else if (contourDrawer === 'shape') {
        contourDrawer = new ShapeContourDrawer(levels);
      } else {
        throw new Error(`unknown contour drawer: ${contourDrawer}`);
      }
    } else {
      throw new TypeError('contourDrawer must be a string');
    }

    const conrec = new ConrecLib(
      contourDrawer.drawContour.bind(contourDrawer),
      options.timeout
    );
    conrec.contour(
      this.matrix,
      0,
      this.xLength - 1,
      0,
      this.yLength - 1,
      this.xs,
      this.ys,
      levels.length,
      levels
    );
    return contourDrawer.getContour();
  }

  _computeMinMax() {
    if (!this.hasMinMax) {
      const r = minMax(this.matrix);
      this.min = r.min;
      this.max = r.max;
      this.hasMinMax = true;
    }
  }
}

function range(from, to, step) {
  const result = [];
  for (let i = from; i < to; i += step) result.push(i);
  return result;
}

function minMax(matrix) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] < min) min = row[j];
      if (row[j] > max) max = row[j];
    }
  }
  return {
    min,
    max
  };
}
