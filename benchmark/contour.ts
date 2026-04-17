// node --cpu-prof benchmark/contour.ts

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { NumberMatrix } from 'cheminfo-types';
import { convert } from 'jcampconverter';

import { Conrec } from '../src/index.ts';

const data = readFileSync(
  join(import.meta.dirname, '../src/__tests__/data/zhmbc_0.jdx'),
  'utf8',
);
const parsed = convert(data, { noContour: true }).flatten[0];

const rawMatrix = parsed.minMax?.z;
if (!rawMatrix) {
  throw new Error('Failed to parse matrix from JCAMP file');
}

const matrix: NumberMatrix = rawMatrix.map((row) => Float64Array.from(row));

// eslint-disable-next-line no-console
console.log('Size: ', matrix[0].length, 'x', matrix.length);

const conrec = new Conrec(matrix);

const levels: number[] = [];
for (let level = -1e4; level <= 1e4; level += 2e2) {
  levels.push(level);
}

// eslint-disable-next-line no-console
console.log(
  `We calculate ${levels.length} levels close to zero to be close to noise`,
);

console.time('basic');

const result = conrec.drawContour({
  contourDrawer: 'basic',
  levels,
  timeout: 100000,
});
// eslint-disable-next-line no-console
console.log(result.contours.length);
console.timeEnd('basic');
const totalNumberContours = result.contours.reduce(
  (acc, contour) => acc + contour.lines.length,
  0,
);
// eslint-disable-next-line no-console
console.log({ totalNumberContours });
