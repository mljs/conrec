import fs from  'fs';
import converter from 'jcampconverter';

import { Conrec } from '..';

describe('conrec basic test', () => {
  console.log('start');
  const data = fs.readFileSync(`${__dirname}/data/zhmbc_0.jdx`, 'utf8');
    console.log('done')
  const parsed = converter.convert(data, { noContour: true });
  console.log('done')
  const conrec = new Conrec(parsed.minMax.z);
console.log('done2')
  var levels = [-1000000, 1000000];
  var nbLevels = levels.length;
  var timeout = 10000;

  const basic = conrec.drawContour({
    contourDrawer: 'basic',
    levels,
    nbLevels,
    timeout
  });

  expect(basic).toMatchSnapshot();

  const shape = conrec.drawContour({
    contourDrawer: 'shape',
    levels,
    nbLevels,
    timeout
  });

  expect(shape).toMatchSnapshot();
});
