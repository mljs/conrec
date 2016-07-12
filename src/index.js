'use strict';

const range = require('js-range');
const stat = require('ml-stat/matrix');

const ConrecLib = require('./Conrec').Conrec;

const defaultOptions = {
    nLevels: 10,
    keepLevels: false
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

    getContours(options) {
        options = Object.assign({}, defaultOptions, options);
        const conrec = new ConrecLib();
        let levels;
        if (options.levels) {
            levels = options.levels.slice();
        } else {
            this._computeMinMax();
            const interval = (this.max - this.min) / (options.nLevels - 1);
            levels = range(this.min, this.max + interval, interval);
        }
        levels.sort((a, b) => a - b);
        if (options.keepLevels) {
            const levelsToCompute = [];
            const result = levels.map(level => {
                if (this.levels.has(level)) {
                    return {level, data: this.levels.get(level)};
                } else {
                    levelsToCompute.push(level);
                    return {level, data: null};
                }
            });
            if (levelsToCompute.length > 0) {
                conrec.contour(this.matrix, 0, this.xLength - 1, 0, this.yLength - 1, this.xs, this.ys, levelsToCompute.length, levelsToCompute);
                const contours = _getContours(conrec.contourList());
                result.forEach(contour => {
                    if (contour.data === null) {
                        contour.data = contours.shift();
                        this.levels.set(contour.level, contour.data);
                    }
                });
                if (contours.length > 0) {
                    throw new Error('unexpected');
                }
            }
            return result.map(level => level.data);
        } else {
            conrec.contour(this.matrix, 0, this.xLength - 1, 0, this.yLength - 1, this.xs, this.ys, levels.length, levels);
            return conrec.contourList();
        }
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

function _getContours(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (!result[el.k]) result[el.k] = [];
        result[el.k].push(el);
    }
    return result;
}

module.exports = Conrec;
