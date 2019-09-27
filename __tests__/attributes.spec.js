/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: info@dribia.com
 */

import { pluck, map, pick } from 'ramda';
import moment from 'moment';
import reducer, {
  getAttribute,
  saveAttribute,
  deleteAttribute,
  getAllAttributes,
  getFilteredAtlasAttributes,
  getAllAttributeNames,
  getSharedAttributes,
} from 'redux/modules/attributes';
import getAge from 'redux/converters/age';
import getAgeRange from 'redux/converters/ageRange';
import { encrypt, decrypt } from 'lib/utils';

describe('Attribute tests', () => {
  test('Default state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('Add attribute', () => {
    expect(
      getAttribute('gender')({
        attributes: reducer({}, saveAttribute('gender', 'male')),
      }),
    ).toEqual('male');
  });

  test('Encrypt', () => {
    expect(decrypt(encrypt('asdlkjasdiutsajhkhasfhafyioasuhfkasbkvasbkvbaskfbv'))).toEqual('asdlkjasdiutsajhkhasfhafyioasuhfkasbkvasbkvbaskfbv');
    expect(decrypt(encrypt(''))).toEqual('');
    expect(decrypt(encrypt('a'))).toEqual('a');
    expect(decrypt(encrypt('13/12/1999'))).toEqual('13/12/1999');
    expect(decrypt(encrypt('Sants-Montjuïc'))).toEqual('Sants-Montjuïc');
  });

  test('Change attribute', () => {
    expect(
      getAttribute('gender')({
        attributes: reducer({
          gender: encrypt('male'),
        }, saveAttribute('gender', 'female')),
      }),
    ).toEqual('female');
  });


  test('Change attribute and getAllAttributes', () => {
    const allAttributes = getAllAttributes({
      attributes: reducer({
        gender: encrypt('male'),
      }, saveAttribute('gender', 'female')),
    });
    expect(map(pick(['name', 'value']), allAttributes)).toEqual([{ name: 'gender', value: 'female' }]);
  });

  test('Add another attribute', () => {
    const allAttributes = getAllAttributes({
      attributes: reducer({
        gender: encrypt('male'),
      }, saveAttribute('birthDate', '23/3/99')),
    });
    expect(map(pick(['name', 'value']), allAttributes)).toEqual([
      {
        name: 'gender',
        value: 'male',
      }, {
        name: 'birthDate',
        value: '23/3/99',
      }]);
  });

  test('Attribute selector', () => {
    expect(getAttribute('gender')({
      attributes: {
        gender: encrypt('male'),
      },
    })).toEqual('male');
  });

  test('All attributes selector', () => {
    const allAttributes = getAllAttributes({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
      },
    });
    expect(map(pick(['name', 'value']), allAttributes)).toEqual([
      {
        name: 'gender',
        value: 'male',
      }, {
        name: 'birthDate',
        value: '23/3/99',
      }]);
  });

  test('All attributes selector empty', () => {
    expect(getAllAttributes({
      attributes: {},
    })).toEqual([]);
  });

  test('All attribute names', () => {
    expect((getAllAttributeNames({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
      },
    }))).toEqual(['gender', 'birthDate']);
  });

  test('Filter atlas attributes', () => {
    expect(pluck('name')(getFilteredAtlasAttributes({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
      },
    }))).toEqual(['district']);
  });

  test('Filter atlas attributes - all', () => {
    expect(pluck('name')(getFilteredAtlasAttributes({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
        address: encrypt('981 Hardman Road'),
        district: encrypt('Sants - Montjuïc'),
      },
    }))).toEqual([]);
  });

  test('Filter atlas attributes - none', () => {
    expect(pluck('name')(getFilteredAtlasAttributes({
      attributes: {},
    }))).toEqual(['gender', 'birthDate', 'district']);
  });

  test('Delete attribute', () => {
    const allAttributes = getAllAttributes({
      attributes: reducer({
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
      }, deleteAttribute('birthDate')),
    });
    expect(map(pick(['name', 'value']), allAttributes)).toEqual([
      {
        name: 'gender',
        value: 'male',
      }]);
  });

  test('Delete attribute - empty', () => {
    expect(
      getAllAttributes({
        attributes: reducer({
          birthDate: encrypt('23/3/99'),
        }, deleteAttribute('birthDate')),
      }),
    ).toEqual([]);
  });

  test('Calculate age', () => {
    const nowForTest = moment('2019-04-29');
    moment.now = () => nowForTest;
    expect(getAge(+moment('2009-07-10'))).toEqual(9);
    expect(getAge(+moment('2009-04-30'))).toEqual(9);
    expect(getAge(+moment('2009-04-29'))).toEqual(10);
    expect(getAge(+moment('2009-04-28'))).toEqual(10);
  });

  test('Get application shared attributes - age', () => {
    const nowForTest = moment('2019-04-29');
    moment.now = () => nowForTest;
    const sharedAttributes = getSharedAttributes('dddc')({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt(+moment('1969-07-20')),
      },
    });
    expect(map(pick(['name', 'value']), sharedAttributes)).toEqual([
      {
        name: 'gender',
        value: 'male',
      },
      {
        name: 'age',
        value: '49',
      },
    ]);
  });

  test('Calculate age range', () => {
    const nowForTest = moment('2019-04-29');
    moment.now = () => nowForTest;
    const ranges = [[0, 18], [18, 25], [25, 35], [35, 45], [45, 55], [55, 65], [65]];
    const config = { ranges };
    expect(getAgeRange(+moment('2019-04-29'), config)).toEqual([0, 18]);
    expect(getAgeRange(+moment('2009-04-30'), config)).toEqual([0, 18]);
    expect(getAgeRange(+moment('2001-04-30'), config)).toEqual([0, 18]);
    expect(getAgeRange(+moment('2001-04-29'), config)).toEqual([18, 25]);
    expect(getAgeRange(+moment('1954-04-30'), config)).toEqual([55, 65]);
    expect(getAgeRange(+moment('1954-04-29'), config)).toEqual([65]);

    expect(getAgeRange(+moment('1000-04-29'), config)).toEqual([65]);
    expect(getAgeRange(+moment('2222-04-29'), config)).toBeUndefined();
    expect(getAgeRange(+moment('2001-04-29'), {})).toBeUndefined();
    expect(getAgeRange(+moment('2001-04-29'))).toBeUndefined();
  });

  test('Get application shared attributes - age range and include base attribute', () => {
    const nowForTest = moment('2019-04-29');
    moment.now = () => nowForTest;
    const birthDateForTest = +moment('1969-07-20');
    const sharedAttributes = getSharedAttributes('bcnnow')({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt(birthDateForTest),
      },
    });
    expect(map(pick(['name', 'value']), sharedAttributes)).toEqual([
      {
        name: 'gender',
        value: 'male',
      },
      {
        name: 'ageRange',
        value: JSON.stringify([45, 55]),
      },
    ]);
    expect(pick(['name', 'value'], sharedAttributes[1].baseAttribute)).toEqual(
      {
        name: 'birthDate',
        value: (birthDateForTest).toString(),
      },
    );
  });
});
