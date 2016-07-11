'use strict';

const fs = require('fs');
const converter = require('jcampconverter');
const Conrec = require('..');

const data = fs.readFileSync(__dirname + '/data/zhmbc_0.jdx', 'utf8');
const parsed = converter.convert(data, {noContour: true});
const conrec = new Conrec(parsed.minMax.z, {keepLevels: true});
console.time('1');
conrec.getContours({levels: [308332726.625]});
console.timeEnd('1');
console.time('2');
conrec.getContours({levels: [359823508.9166666]});
console.timeEnd('2');
console.time('3');
conrec.getContours({levels: [308332726.625, 359823508.9166666]});
console.timeEnd('3');
  //  });
//});

/*
 [ -611967.125,
 50878815.166666664,
 102369597.45833333,
 153860379.75,
 205351162.04166666,
 256841944.3333333,
 308332726.625,
 359823508.9166666,
 411314291.2083333,
 462805073.5 ]

 */