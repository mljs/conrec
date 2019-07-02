declare module 'ml-conrec' {
  export interface ConrecOptions {
    xs?: number[];
    ys?: number[];
  }

  export interface ConrecContourOptionsNbLevels {
    nbLevels?: number;
    contourDrawer?: 'basic' | 'shape';
    timeout?: number;
    swapAxes?: boolean;
  }

  export interface ConrecContourOptionsLevels {
    levels?: number[];
    contourDrawer?: 'basic' | 'shape';
    timeout?: number;
  }

  export class Conrec {
    constructor(matrix: number[][], options?: ConrecOptions);
    drawContour(options?: ConrecContourOptionsNbLevels): any;
    drawContour(options?: ConrecContourOptionsLevels): any;
  }
}
