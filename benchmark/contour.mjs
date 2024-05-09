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

const conrec = new Conrec(parsed.minMax.z);

const number = 100

console.time('basic');
for (let i = 0; i < number; i++) {

  conrec.drawContour({
    contourDrawer: 'basic',
    levels: [-100000, 100000],
    timeout: 10000,
  });
}
console.timeEnd('basic');

if (false) {
  console.time('shape');
  for (let i = 0; i < number; i++) {
    conrec.drawContour({
      contourDrawer: 'shape',
      levels: [-100000, 100000],
      timeout: 10000,
    });
  }
  console.timeEnd('shape');
}