import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { NumberMatrix } from 'cheminfo-types';
import { convert } from 'jcampconverter';
import { expect, test } from 'vitest';

import { Conrec } from '../index.ts';

const data = readFileSync(
  join(import.meta.dirname, 'data/zhmbc_0.jdx'),
  'utf8',
);
const parsed = convert(data, { noContour: true }).flatten[0];
const matrix: NumberMatrix = parsed.minMax?.z || [];

test('no result because level too far', () => {
  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    levels: [-1000000000, 1000000000],
    timeout: 10000,
  });

  expect(timeout).toBe(false);
  expect(contours).toStrictEqual([
    { lines: [], zValue: -1000000000 },
    { lines: [], zValue: 1000000000 },
  ]);
});

test('2 specified levels', () => {
  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    levels: [-100000, 100000],
    timeout: 10000,
  });

  expect(timeout).toBe(false);
  expect(contours).toHaveLength(2);
  expect(contours[0].lines).toHaveLength(36864);
  expect(contours[1].lines).toHaveLength(119720);
});

test('no levels', () => {
  const conrec = new Conrec(matrix);
  const start = Date.now();
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    levels: [],
    timeout: 10000,
  });

  expect(Date.now() - start).toBeLessThan(25);
  expect(timeout).toBe(false);
  expect(contours).toHaveLength(0);
});

test('auto select levels', () => {
  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    nbLevels: 10,
    timeout: 10000,
  });

  expect(timeout).toBe(false);
  expect(contours).toHaveLength(10);
  expect(contours[0].lines).toHaveLength(0);
  expect(contours[1].lines).toHaveLength(4984);
  expect(contours[8].lines).toHaveLength(32);
  expect(contours[8].lines).toMatchSnapshot();
  expect(contours[9].lines).toHaveLength(0);
});

test('auto select levels with swapAxes', () => {
  const conrec = new Conrec(matrix, { swapAxes: true });
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    nbLevels: 10,
    timeout: 10000,
  });

  expect(timeout).toBe(false);
  expect(contours).toHaveLength(10);
  expect(contours[0].lines).toHaveLength(0);
  expect(contours[1].lines).toHaveLength(4984);
  expect(contours[8].lines).toHaveLength(32);
  expect(contours[8].lines).toMatchSnapshot();
  expect(contours[9].lines).toHaveLength(0);
});

test('return available contours within 100ms', () => {
  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'basic',
    nbLevels: 10,
    timeout: 10,
  });

  expect(timeout).toBe(true);
  expect(contours).toHaveLength(10);
  expect(contours[0].lines).toHaveLength(0);
  expect(contours[1].lines.length).toBeLessThan(2000);
  expect(contours[8].lines).toHaveLength(0);
  expect(contours[9].lines).toHaveLength(0);
});
