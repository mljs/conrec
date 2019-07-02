import fs from 'fs';

import converter from 'jcampconverter';

import { Conrec } from '..';

const data = fs.readFileSync(`${__dirname}/data/zhmbc_0.jdx`, 'utf8');
const parsed = converter.convert(data, { noContour: true });

describe('conrec basic test', () => {
  it('no result because level too far', () => {
    const conrec = new Conrec(parsed.minMax.z);
    const basic = conrec.drawContour({
      contourDrawer: 'basic',
      levels: [-1000000000, 1000000000],
      timeout: 10000,
    });

    expect(basic).toStrictEqual([
      { lines: [], zValue: -1000000000 },
      { lines: [], zValue: 1000000000 },
    ]);
  });

  it('2 specified levels', () => {
    const conrec = new Conrec(parsed.minMax.z);
    const basic = conrec.drawContour({
      contourDrawer: 'basic',
      levels: [-100000, 100000],
      timeout: 10000,
    });

    expect(basic).toHaveLength(2);
    expect(basic[0].lines).toHaveLength(36864);
    expect(basic[1].lines).toHaveLength(119720);
  });

  it('auto select levels', () => {
    const conrec = new Conrec(parsed.minMax.z);
    const basic = conrec.drawContour({
      contourDrawer: 'basic',
      nbLevels: 10,
      timeout: 10000,
    });

    expect(basic).toHaveLength(10);
    expect(basic[0].lines).toHaveLength(0);
    expect(basic[1].lines).toHaveLength(4984);
    expect(basic[8].lines).toHaveLength(32);
    expect(basic[8].lines).toMatchSnapshot();
    expect(basic[9].lines).toHaveLength(0);
  });

  it('auto select levels with swapAxes', () => {
    const conrec = new Conrec(parsed.minMax.z, { swapAxes: true });
    const basic = conrec.drawContour({
      contourDrawer: 'basic',
      nbLevels: 10,
      timeout: 10000,
    });

    expect(basic).toHaveLength(10);
    expect(basic[0].lines).toHaveLength(0);
    expect(basic[1].lines).toHaveLength(4984);
    expect(basic[8].lines).toHaveLength(32);
    expect(basic[8].lines).toMatchSnapshot();
    expect(basic[9].lines).toHaveLength(0);
  });
});
