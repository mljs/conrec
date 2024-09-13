// node --cpu-prof benchmark/contour.mjs

import { readFileSync } from 'fs';
import { join } from 'path'

import { convert } from 'jcampconverter';

import { Conrec } from '../lib/index.js';

const __dirname = new URL('.', import.meta.url).pathname;

const data = readFileSync(join(__dirname, '../src/__tests__/data/zhmbc_0.jdx'), 'utf8');
const parsed = convert(data, { noContour: true }).flatten[0];

for (let i = 0; i < parsed.minMax.z.length; i++) {
  parsed.minMax.z[i] = Float64Array.from(parsed.minMax.z[i])
}

console.log('Size: ', parsed.minMax.z[0].length, 'x', parsed.minMax.z.length);

const conrec = new Conrec(parsed.minMax.z);

let levels = [];
for (let level = -1e4; level <= 1e4; level += 2e2) {
  levels.push(level);
}

console.log(`We calculate ${levels.length} levels close to zero to be close to noise`);

let result;

if (true) {
  console.time('basic');

  result = (conrec.drawContour({
    contourDrawer: 'basic',
    levels,
    timeout: 100000,
  }));
  console.log(result.contours.length)
  console.timeEnd('basic');
  const totalNumberContours = result.contours.reduce((acc, contour) => acc + contour.lines.length, 0);
  console.log({ totalNumberContours })
} else {
  console.time('shape');
  result = conrec.drawContour({
    contourDrawer: 'shape',
    levels,
    timeout: 1000000,
  });
  console.timeEnd('shape');
  // console.log(result)
  console.log(result.contours.length)
  const totalNumberContours = result.contours.reduce((acc, contour) => acc + contour.lines.length, 0);
  console.log({ totalNumberContours })

}

