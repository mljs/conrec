import { readFileSync } from 'fs';
import { join } from 'path'

import { convert } from 'jcampconverter';

import { Conrec } from '../src/index.js';

const data = readFileSync(join(__dirname, '../src/__tests__/data/zhmbc_0.jdx'), 'utf8');
const parsed = convert(data, { noContour: true }).flatten[0];

for (let i = 0; i < parsed.minMax.z.length; i++) {
  parsed.minMax.z[i] = Float64Array.from(parsed.minMax.z[i])
}

const conrec = new Conrec(parsed.minMax.z);

console.time('basic');
for (let i = 0; i < 20; i++) {

  conrec.drawContour({
    contourDrawer: 'basic',
    levels: [-100000, 100000],
    timeout: 10000,
  });
}
console.timeEnd('basic');

console.time('shape');
for (let i = 0; i < 20; i++) {
  conrec.drawContour({
    contourDrawer: 'shape',
    levels: [-1000000000, 1000000000],
    timeout: 10000,
  });
}
console.timeEnd('shape');
