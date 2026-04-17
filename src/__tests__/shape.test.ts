import { expect, test } from 'vitest';

import { Conrec } from '../index.ts';

test('square', () => {
  const matrix = parse(`
    00000
    01110
    01110
    01110
    00000
  `);

  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'shape',
    levels: [0.5],
  });

  expect(timeout).toBe(false);
  expect(contours[0].lines).toHaveLength(25);
});

test('2 squares', () => {
  const matrix = parse(`
    000000000
    011101110
    011101110
    011101110
    000000000
  `);

  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'shape',
    levels: [0.5],
  });

  expect(timeout).toBe(false);
  expect(contours[0].lines).toHaveLength(25);
});

test('2 diagonal squares', () => {
  const matrix = parse(`
    000000000
    011100000
    011100000
    011100000
    000011100
    000011100
    000011100
    000000000
  `);

  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'shape',
    levels: [0.5],
  });

  expect(timeout).toBe(false);
  expect(contours[0].lines).toHaveLength(49);
});

test('square float matrix', () => {
  const matrix: Float64Array[] = [
    Float64Array.from([0, 0, 0.1, 0, 0]),
    Float64Array.from([0, 0.9, 1, 1, 0]),
    Float64Array.from([0, 1, 1, 1, 0]),
    Float64Array.from([0, 1, 1, 0.8, 0]),
    Float64Array.from([0, 0, 0, 0, 0.1]),
  ];

  const conrec = new Conrec(matrix);
  const { contours, timeout } = conrec.drawContour({
    contourDrawer: 'shape',
    levels: [0.5],
  });

  expect(timeout).toBe(false);
  expect(contours[0].lines).toHaveLength(29);
});

function parse(string: string) {
  const lines = string
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const matrix: number[][] = [];
  for (const line of lines) {
    matrix.push(
      line.split('').map((value: string) => Number.parseInt(value, 10)),
    );
  }
  return matrix;
}
