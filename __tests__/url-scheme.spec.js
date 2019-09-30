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

import { parseQRCode, errorObj } from 'lib/url-scheme';

describe('URL scheme parsing tests', () => {
  test('Legacy DDDC', () => {
    expect(parseQRCode('decodeapp://?mobile=true&decidimAPIUrl=https://dddc.decodeproject.eu/api/&petitionId=2')).toEqual({
      application: 'dddc',
      decidimAPIUrl: 'https://dddc.decodeproject.eu/api/',
      petitionId: '2',
    });
  });

  test('Legacy BCNNow', () => {
    expect(parseQRCode('decodeapp://login?&sessionId=f84a31f8d60d11e9b12a005056833c52&callback=http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback')).toEqual({
      application: 'bcnnow',
      callback: 'http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback',
      sessionId: 'f84a31f8d60d11e9b12a005056833c52',
    });
  });

  test('Bad url', () => {
    const url = 'decode://login?badUrl';
    expect(parseQRCode(url)).toEqual(errorObj(url));
  });

  test('Standard DDDC', () => {
    expect(parseQRCode('decodeapp://support?decidimAPIUrl=https://dddc.decodeproject.eu/api/&serviceId=2')).toEqual({
      application: 'dddc',
      decidimAPIUrl: 'https://dddc.decodeproject.eu/api/',
      petitionId: '2',
    });
  });

  test('Standard BCNNow', () => {
    expect(parseQRCode('decodeapp://login?&sessionId=f84a31f8d60d11e9b12a005056833c52&callback=http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback')).toEqual({
      application: 'bcnnow',
      callback: 'http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback',
      sessionId: 'f84a31f8d60d11e9b12a005056833c52',
    });
  });

  test('Check decodeapp: protocol', () => {
    const url = 'http://support?decidimAPIUrl=https://dddc.decodeproject.eu/api/&serviceId=2';
    expect(parseQRCode(url)).toEqual(errorObj(url));
  });

  test('Check valid action', () => {
    const url = 'decodeapp://badAction?decidimAPIUrl=https://dddc.decodeproject.eu/api/&serviceId=2';
    expect(parseQRCode(url)).toEqual(errorObj(url));
  });

  test('Check mandatory service id', () => {
    const url = 'decodeapp://support?decidimAPIUrl=https://dddc.decodeproject.eu/api/';
    expect(parseQRCode(url)).toEqual(errorObj(url));
  });

  test('Check known parameters', () => {
    const url = 'decodeapp://support?badParameter=https://dddc.decodeproject.eu/api/&serviceId=2';
    expect(parseQRCode(url)).toEqual(errorObj(url));
  });
});
