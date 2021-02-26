import fs from 'fs';

import converter from 'jcampconverter';

import { Conrec } from '..';

describe('shape', () => {
  it('square', () => {
    const matrix = parse(`
      00000
      01110
      01110
      01110
      00000
    `);

    const conrec = new Conrec(matrix);
    const shape = conrec.drawContour({
      contourDrawer: 'shape',
      levels: [0.5],
    });
    expect(shape[0]).toHaveLength(25)
  });

  it('2 squares', () => {
    const matrix = parse(`
      000000000
      011101110
      011101110
      011101110
      000000000
    `);

    const conrec = new Conrec(matrix);
    const shape = conrec.drawContour({
      contourDrawer: 'shape',
      levels: [0.5],
    });

    expect(shape[0]).toHaveLength(25)
  });

  it('2 diagonal squares', () => {
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
    const shape = conrec.drawContour({
      contourDrawer: 'shape',
      levels: [0.5],
    });

    expect(shape[0]).toHaveLength(49)
  });
});

function parse(string) {
  let lines = string
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);
  let width = lines[0].length;
  let height = lines.length;

  let matrix = [];
  for (let line of lines) {
    matrix.push(line.split('').map((value) => parseInt(value)));
  }
  return matrix;
}
