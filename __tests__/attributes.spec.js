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

import reducer, {
  getAttribute, saveAttribute, getAllAttributes,
} from 'redux/modules/attributes';
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
    expect(
      getAllAttributes({
        attributes: reducer({
          gender: encrypt('male'),
        }, saveAttribute('gender', 'female')),
      }),
    ).toEqual([{ name: 'gender', value: 'female' }]);
  });

  test('Add another attribute', () => {
    expect(
      getAllAttributes({
        attributes: reducer({
          gender: encrypt('male'),
        }, saveAttribute('birthDate', '23/3/99')),
      }),
    ).toEqual([
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
    expect(getAllAttributes({
      attributes: {
        gender: encrypt('male'),
        birthDate: encrypt('23/3/99'),
      },
    })).toEqual([
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
});
