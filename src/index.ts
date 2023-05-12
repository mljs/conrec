import { BasicContourDrawer } from './BasicContourDrawer';
import { ShapeContourDrawer } from './ShapeContourDrawer';
import { calculateContour } from './calculateContour';

const defaultOptions = {
  nbLevels: 10,
  timeout: 0,
};
interface ConrecOptions {
  xs?: number[];
  ys?: number[];
  swapAxes?: boolean;
}
export type ContourDrawer = BasicContourDrawer | ShapeContourDrawer;
/**
 *
 * @class Conrec
 * @param {number[][]} matrix
 * @param {number[]} [options.xs]
 * @param {number[]} [options.ys]
 * @param {boolean} [options.swapAxes]
 */
export class Conrec {
  matrix: number[][];
  rows: number;
  columns: number;
  xs: number[];
  ys: number[];
  swapAxes: boolean;
  hasMinMax: boolean;
  min: number;
  max: number;

  constructor(matrix: number[][], options: ConrecOptions = {}) {
    const { swapAxes = false } = options;
    this.matrix = matrix;
    this.rows = matrix.length;
    this.columns = matrix[0].length;

    if (swapAxes) {
      // We swap axes, which means xs are in the rows direction. This is the normal
      // way for the conrec library.
      this.xs = options.xs || range(0, this.rows, 1);
      this.ys = options.ys || range(0, this.columns, 1);
    } else {
      // We do not swap axes, so if the user provided xs or ys, we must swap the
      // internal values so the algorithm can still work.
      this.xs = options.ys || range(0, this.rows, 1);
      this.ys = options.xs || range(0, this.columns, 1);
    }

    this.swapAxes = swapAxes;
    this.hasMinMax = false;
    this.min = 0;
    this.max = 0;
  }

  /**
   * @typedef {Object} Output
   * @property {any} contours
   * @property {boolean} timeout - Whether contour generation had to stop early because it reached the timeout
   */

  /**
   *
   * @param {number[]} [options.levels]
   * @param {number} [options.nbLevels=10]
   * @param {string} [options.contourDrawer='basic'] - 'basic' or 'shape'
   * @param {number} [options.timeout=0]
   * @return {Output}
   */
  drawContour(options: {
    levels?: number[];
    nbLevels?: number;
    contourDrawer?: string;
    timeout?: number;
  }) {
    const { nbLevels, timeout } = { ...defaultOptions, ...options };

    let levels: number[];
    if (options.levels) {
      levels = options.levels.slice();
    } else {
      this._computeMinMax();
      const interval = (this.max - this.min) / (nbLevels - 1);
      levels = range(this.min, this.max + interval, interval);
    }
    levels.sort((a, b) => a - b);
    let contourDrawer: ContourDrawer | null = null;
    const contourDrawerType = options.contourDrawer || 'basic';
    if (typeof contourDrawerType === 'string') {
      if (contourDrawerType === 'basic') {
        contourDrawer = new BasicContourDrawer(levels, this.swapAxes);
      } else if (contourDrawerType === 'shape') {
        contourDrawer = new ShapeContourDrawer(levels, this.swapAxes);
      } else {
        throw new Error(`unknown contour drawer: ${contourDrawerType}`);
      }
    } else {
      throw new TypeError('contourDrawer must be a string');
    }
    const isTimeout = calculateContour(
      this.matrix,
      this.xs,
      this.ys,
      levels,
      contourDrawer,
      {
        timeout,
      },
    );

    return { contours: contourDrawer.getContour(), timeout: isTimeout };
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

function range(from: number, to: number, step: number) {
  const result: number[] = [];
  for (let i = from; i < to; i += step) result.push(i);
  return result;
}

function minMax(matrix: number[][]) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const row of matrix) {
    for (const val of row) {
      if (val < min) min = val;
      if (val > max) max = val;
    }
  }
  return {
    min,
    max,
  };
}
