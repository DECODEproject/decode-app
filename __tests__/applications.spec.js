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

import moment from 'moment';
import reducer, { initialState, getApplicationStats } from 'redux/modules/applications';
import { getImage } from 'api/atlas-client';

const baseFinalState = [{
  id: 'dddc',
  name: 'dddcName',
  title: 'dddcTitle',
  image: 'people',
  link: 'https://dddc.decodeproject.eu',
  description: 'dddcDesc',
  usageCount: 0,
  numCertificates: 0,
},
{
  id: 'bcnnow',
  name: 'bcnnowName',
  title: 'bcnnowTitle',
  image: 'city',
  link: 'http://bcnnow.decodeproject.eu',
  description: 'bcnnowDesc',
  usageCount: 0,
  numCertificates: 0,
  averageUse: undefined,
},
];

describe('Application tests', () => {
  test('Default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  test('Application stats', () => {
    const nowForTest = moment('2019-04-30');
    moment.now = () => nowForTest;
    expect(
      getApplicationStats({
        applications: initialState,
      }),
    ).toEqual([
      {
        ...baseFinalState[0],
        usageCount: 2,
        firstUse: +moment('2019-02-11'),
        lastUse: +moment('2019-04-21'),
        sharedData: [
          { id: 'gender', shared: true },
          { id: 'birthDate', shared: false },
          { id: 'address', shared: true },
        ],
        averageUse: 6,
        numCertificates: 1,
      },
      {
        ...baseFinalState[1],
        firstUse: undefined,
        lastUse: undefined,
        sharedData: [
          { id: 'gender', shared: false },
          { id: 'birthDate', shared: false },
          { id: 'address', shared: false },
        ],
      },
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
            uses: [
              {
                date: +moment('2019-03-21'),
                sharedData: ['gender', 'birthDate'],
              },
              {
                date: +moment('2019-04-21'),
                sharedData: ['gender', 'birthDate'],
              },
            ],
            numCertificates: 2,
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
