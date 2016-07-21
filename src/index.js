'use strict';

const range = require('js-range');
const stat = require('ml-stat/matrix');

const ConrecLib = require('./Conrec');
const BasicContourDrawer = require('./BasicContourDrawer');
const ShapeContourDrawer = require('./ShapeContourDrawer');

const defaultOptions = {
    nbLevels: 10,
    timeout: 0
};

class Conrec {
    constructor(matrix, options) {
        options = options || {};
        this.matrix = matrix;
        this.xLength = matrix.length;
        this.yLength = matrix[0].length;
        this.xs = options.xs ? options.xs : range(0, this.xLength, 1);
        this.ys = options.ys ? options.ys : range(0, this.yLength, 1);
        this.levels = new Map();
        this.hasMinMax = false;
    }

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
                throw new Error('unknown contour drawer: ' + contourDrawer);
            }
        }

        const conrec = new ConrecLib(contourDrawer.drawContour.bind(contourDrawer), options.timeout);
        conrec.contour(this.matrix, 0, this.xLength - 1, 0, this.yLength - 1, this.xs, this.ys, levels.length, levels);
        return contourDrawer.getContour();
    }

    _computeMinMax() {
        if (!this.hasMinMax) {
            const minMax = stat.minMax(this.matrix);
            this.min = minMax.min;
            this.max = minMax.max;
            this.hasMinMax = true;
        }
    }
}

module.exports = Conrec;
