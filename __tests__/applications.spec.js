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

import reducer, { initialState, getApplicationStats } from 'redux/modules/applications';
import { getImage } from 'api/atlas-client';

const baseFinalState = [{
  id: 'dddc',
  name: 'dddcName',
  title: 'dddcTitle',
  image: 'people',
  link: 'https://dddc.decodeproject.eu',
  description: 'dddcDesc',
  uses: 0,
  certificates: 0,
},
{
  id: 'bcnnow',
  name: 'bcnnowName',
  title: 'bcnnowTitle',
  image: 'city',
  link: 'http://bcnnow.decodeproject.eu',
  description: 'bcnnowDesc',
  uses: 0,
  certificates: 0,
},
];

describe('Application tests', () => {
  test('Default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  test('Application stats', () => {
    expect(
      getApplicationStats({
        applications: initialState,
      }),
    ).toEqual([
      {
        ...baseFinalState[0],
        uses: 2,
        certificates: 1,
      },
      baseFinalState[1],
    ]);
  });

  test('Application stats - missing user apps', () => {
    expect(
      getApplicationStats({
        applications: {},
      }),
    ).toEqual(baseFinalState);
  });

  test('Application stats - extra user apps', () => {
    expect(
      getApplicationStats({
        applications: {
          notSupportedAnymoreApp: {
            uses: 6,
            certificates: 3,
          },
        },
      }),
    ).toEqual(baseFinalState);
  });

  test('getImage', () => {
    expect(getImage('people')).toBeDefined();
    expect(getImage('notExist')).toBeUndefined();
  });
});
