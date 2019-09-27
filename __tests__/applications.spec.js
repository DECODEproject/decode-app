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
import i18n from 'i18n';
import { pluck, pick, map } from 'ramda';
import reducer, {
  getApplicationStats,
  calculateAverage,
  getAllCertificates,
  getSharedAttributes,
} from 'redux/modules/applications';
import { initialState as dddcInitialState } from 'redux/modules/applications/dddc';
import { initialState as bcnnowInitialState } from 'redux/modules/applications/bcnnow';
import { getImage } from 'api/atlas-client';
import { encrypt } from 'lib/utils';

const initialState = {
  dddc: dddcInitialState,
  bcnnow: bcnnowInitialState,
};

const baseFinalState = [{
  id: 'dddc',
  name: 'dddc.name',
  title: 'dddc.title',
  image: 'people',
  link: 'https://dddc.decodeproject.eu',
  description: 'dddc.desc',
  usageCount: 0,
  numCertificates: 0,
  actionMsg: 'dddc.sign',
  activationMsg: 'dddc.activation',
},
{
  id: 'bcnnow',
  name: 'bcnnow.name',
  title: 'bcnnow.title',
  image: 'city',
  link: 'http://bcnnow.decodeproject.eu',
  description: 'bcnnow.desc',
  usageCount: 0,
  numCertificates: 0,
  actionMsg: 'bcnnow.login',
  activationMsg: 'bcnnow.activation',
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
        applications: {
          dddc: {
            ...dddcInitialState,
            uses: [
              {
                date: +moment('2019-02-11'),
                sharedData: ['gender'],
              },
              {
                date: +moment('2019-04-21'),
                sharedData: ['age'],
              },
            ],
          },
          bcnnow: bcnnowInitialState,
        },
      }),
    ).toEqual([
      {
        ...baseFinalState[0],
        usageCount: 2,
        firstUse: +moment('2019-02-11'),
        lastUse: +moment('2019-04-21'),
        sharedData: [
          { id: 'gender', shared: true },
          { id: 'age', shared: true },
          { id: 'district', shared: false },
        ],
        averageUse: [1, 'month'],
      },
      {
        ...baseFinalState[1],
        averageUse: [0, 'year'],
        firstUse: undefined,
        lastUse: undefined,
        sharedData: [
          { id: 'gender', shared: false },
          { id: 'ageRange', shared: false },
          { id: 'district', shared: false },
        ],
      },
    ]);
  });

  test('Application stats - count certificates', () => {
    const nowForTest = moment('2019-04-30');
    moment.now = () => nowForTest;
    expect(
      getApplicationStats({
        applications: {
          dddc: {
            ...dddcInitialState,
            certificates: {
              aaa111: {},
              aaa222: {},
            },
          },
          bcnnow: bcnnowInitialState,
        },
      }),
    ).toEqual([
      {
        ...baseFinalState[0],
        averageUse: [0, 'year'],
        firstUse: undefined,
        lastUse: undefined,
        sharedData: [
          { id: 'gender', shared: false },
          { id: 'age', shared: false },
          { id: 'district', shared: false },
        ],
        numCertificates: 2,
      },
      {
        ...baseFinalState[1],
        averageUse: [0, 'year'],
        firstUse: undefined,
        lastUse: undefined,
        sharedData: [
          { id: 'gender', shared: false },
          { id: 'ageRange', shared: false },
          { id: 'district', shared: false },
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

  test('Calculate Average', () => {
    const nowForTest = moment('2019-12-31T23:59:59+01:00');
    moment.now = () => nowForTest;
    expect(calculateAverage(moment('2019-01-01'), 5)).toEqual([5, 'year']);
    expect(calculateAverage(moment('2019-01-01'), 12)).toEqual([1, 'month']);
    expect(calculateAverage(moment('2019-01-01'), 24)).toEqual([2, 'month']);
    expect(calculateAverage(moment('2019-01-01'), 60)).toEqual([1, 'week']);
    expect(calculateAverage(moment('2019-01-01'), 120)).toEqual([2, 'week']);
    expect(calculateAverage(moment('2019-12-31'), 2)).toEqual([2, 'day']);
    expect(calculateAverage(moment('2018-01-01'), 1)).toEqual([1, 'year']);
    expect(calculateAverage(moment('2017-12-31'), 1)).toEqual([0, 'year']);
  });

  test('Calculate more averages', () => {
    const nowForTest = moment('2019-07-10T11:08:59.000Z');
    moment.now = () => nowForTest;
    expect(calculateAverage(moment('2019-02-11'), 2)).toEqual([5, 'year']);
    expect(calculateAverage(moment('2019-07-10T11:08:50.000Z'), 1)).toEqual([1, 'day']);
  });


  test('Translations by interval', () => {
    expect(i18n.t('applications:activate')).toEqual('Activate application via QR');
    expect(i18n.t('applications:times_interval', {
      postProcess: 'interval',
      count: 3,
      unit: 'week',
    })).toEqual('3 times a week');
    expect(i18n.t('applications:times_interval', {
      postProcess: 'interval',
      count: 1,
      unit: 'week',
    })).toEqual('Once a week');
    expect(i18n.t('applications:times_interval', {
      postProcess: 'interval',
      count: 2,
      unit: 'week',
    })).toEqual('Twice a week');
    expect(i18n.t('applications:times_interval', {
      postProcess: 'interval',
      count: 0,
      unit: 'year',
    })).toEqual('Less than once a year');
    i18n.changeLanguage('ca', (err, t) => {
      if (err) throw err;
      expect(t('applications:activate')).toEqual('Activar aplicació via QR');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 3,
        unit: 'setmana',
      })).toEqual('3 cops per setmana');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 1,
        unit: 'setmana',
      })).toEqual('1 cop per setmana');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 2,
        unit: 'setmana',
      })).toEqual('2 cops per setmana');
      expect(i18n.t('applications:times_interval', {
        postProcess: 'interval',
        count: 0,
        unit: 'any',
      })).toEqual('Menys d\'un cop per any');
    });
    i18n.changeLanguage('es', (err, t) => {
      if (err) throw err;
      expect(t('applications:activate')).toEqual('Activar aplicación vía QR');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 3,
        unit: 'semana',
      })).toEqual('3 veces por semana');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 1,
        unit: 'semana',
      })).toEqual('1 vez por semana');
      expect(t('applications:times_interval', {
        postProcess: 'interval',
        count: 2,
        unit: 'semana',
      })).toEqual('2 veces por semana');
      expect(i18n.t('applications:times_interval', {
        postProcess: 'interval',
        count: 0,
        unit: 'año',
      })).toEqual('Menos de una vez por año');
    });
  });

  test('Get all certificates', () => {
    const nowForTest = moment('2019-04-30');
    moment.now = () => nowForTest;
    expect(
      getAllCertificates({
        applications: {
          dddc: {
            ...dddcInitialState,
            certificates: {
              aaa111: {},
              aaa222: {},
            },
          },
          bcnnow: {
            ...bcnnowInitialState,
            certificates: {
              bbb111: {},
              bbb222: {},
            },
          },
        },
      }),
    ).toEqual({
      aaa111: {},
      aaa222: {},
      bbb111: {},
      bbb222: {},
    });
  });

  test('Get all certificates - with empty', () => {
    const nowForTest = moment('2019-04-30');
    moment.now = () => nowForTest;
    expect(
      getAllCertificates({
        applications: {
          dddc: {
            ...dddcInitialState,
            certificates: {
              aaa111: {},
              aaa222: {},
            },
          },
          bcnnow: {
            ...bcnnowInitialState,
          },
        },
      }),
    ).toEqual({
      aaa111: {},
      aaa222: {},
    });
  });

  test('Get shared attributes - shape', () => {
    const result = getSharedAttributes('dddc')({
      attributes: {
        birthDate: encrypt('birthDate-value'),
        address: encrypt('address-value'),
      },
      applications: {
        dddc: {
          ...dddcInitialState,
        },
        bcnnow: {
          ...bcnnowInitialState,
        },
      },
    });
    expect(map(pick(['name', 'type']), result)).toEqual([
      {
        name: 'age',
        type: 'number',
      },
      {
        name: 'gender',
        type: 'enum',
      },
      {
        name: 'district',
        type: 'enum',
      },
    ]);
  });

  test('Get shared attributes - sort', () => {
    expect(
      pluck('name', getSharedAttributes('dddc')({
        attributes: {
          birthDate: encrypt('birthDate-value'),
          district: encrypt('district-value'),
        },
        applications: {
          dddc: {
            ...dddcInitialState,
          },
          bcnnow: {
            ...bcnnowInitialState,
          },
        },
      })),
    ).toEqual(['age', 'district', 'gender']);
    expect(
      pluck('name', getSharedAttributes('dddc')({
        attributes: {
          gender: encrypt('gender-value'),
          district: encrypt('district-value'),
        },
        applications: {
          dddc: {
            ...dddcInitialState,
          },
          bcnnow: {
            ...bcnnowInitialState,
          },
        },
      })),
    ).toEqual(['gender', 'district', 'age']);
    expect(
      pluck('name', getSharedAttributes('bcnnow')({
        attributes: {
          birthDate: encrypt('birthDate-value'),
          district: encrypt('district-value'),
        },
        applications: {
          dddc: {
            ...dddcInitialState,
          },
          bcnnow: {
            ...bcnnowInitialState,
          },
        },
      })),
    ).toEqual(['ageRange', 'district', 'gender']);
  });

  test('Get shared attributes - values and base attributes', () => {
    const birthDateForTest = +moment('1997-01-01');
    const result = getSharedAttributes('dddc')({
      attributes: {
        birthDate: encrypt(birthDateForTest),
        gender: encrypt('male'),
      },
      applications: {
        dddc: {
          ...dddcInitialState,
        },
        bcnnow: {
          ...bcnnowInitialState,
        },
      },
    });
    const { name, value, baseAttribute } = result[1];
    expect(name).toEqual('age');
    expect(value).toEqual('22');
    const { value: baseValue, name: baseName } = baseAttribute;
    expect(baseName).toEqual('birthDate');
    expect(baseValue).toEqual(birthDateForTest.toString());
  });
});
