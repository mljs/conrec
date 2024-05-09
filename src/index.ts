import { NumberArray, NumberMatrix } from 'cheminfo-types';

import { BasicContourDrawer } from './BasicContourDrawer';
import { ShapeContourDrawer } from './ShapeContourDrawer';
import { calculateContour } from './calculateContour';

interface ConrecOptions {
  xs?: Readonly<NumberArray>;
  ys?: Readonly<NumberArray>;
  swapAxes?: boolean;
}

export type ContourDrawer = BasicContourDrawer | ShapeContourDrawer;

export type ContourDrawerName = 'basic' | 'shape';

type ContourDrawerByName<DrawerName extends ContourDrawerName> =
  DrawerName extends 'basic' ? BasicContourDrawer : ShapeContourDrawer;

export interface DrawContourResult<DrawerName extends ContourDrawerName> {
  contours: ReturnType<ContourDrawerByName<DrawerName>['getContour']>;
  timeout: boolean;
}

export class Conrec {
  matrix: Readonly<NumberMatrix>;
  rows: number;
  columns: number;
  xs: Readonly<NumberArray>;
  ys: Readonly<NumberArray>;
  swapAxes: boolean;
  hasMinMax: boolean;
  min: number;
  max: number;

  constructor(matrix: Readonly<NumberMatrix>, options: ConrecOptions = {}) {
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

  drawContour<DrawerName extends ContourDrawerName>(options: {
    levels?: readonly number[];
    nbLevels?: number;
    contourDrawer?: DrawerName;
    timeout?: number;
  }): DrawContourResult<DrawerName> {
    const { nbLevels = 10, timeout = 0, contourDrawer = 'basic' } = options;

    let levels: number[];
    if (options.levels) {
      levels = [...options.levels];
    } else {
      this._computeMinMax();
      const interval = (this.max - this.min) / (nbLevels - 1);
      levels = range(this.min, this.max + interval, interval);
    }
    levels.sort((a, b) => a - b);
    let contourDrawerInstance: ContourDrawer;
    if (typeof contourDrawer === 'string') {
      if (contourDrawer === 'basic') {
        contourDrawerInstance = new BasicContourDrawer(levels, this.swapAxes);
      } else if (contourDrawer === 'shape') {
        contourDrawerInstance = new ShapeContourDrawer(levels, this.swapAxes);
      } else {
        throw new Error(`invalid contour drawer: ${String(contourDrawer)}`);
      }
    } else {
      throw new TypeError('contourDrawer must be a string');
    }
    const isTimeout = calculateContour(
      this.matrix,
      this.xs,
      this.ys,
      levels,
      contourDrawerInstance,
      {
        timeout,
      },
    );

    return {
      contours: contourDrawerInstance.getContour() as ReturnType<
        ContourDrawerByName<DrawerName>['getContour']
      >,
      timeout: isTimeout,
    };
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

function range(from: number, to: number, step: number): number[] {
  const result: number[] = [];
  for (let i = from; i < to; i += step) {
    result.push(i);
  }
  return result;
}

function minMax(matrix: Readonly<NumberMatrix>) {
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
