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
import reducer, { ACTIONS } from '../src/redux/reducers/index';

describe('Walkthrough tests', () => {
  test('Default state', () => {
    expect(reducer(undefined, {})).toEqual({
      firstRun: true,
      showTooltip: {
        dummy: 'refresh',
        dummyNext: 'crash',
      },
      total: '---',
      loading: false,
      date: '---',
    });
  });
  test('Close first tooltip', () => {
    expect(reducer(undefined, {
      type: ACTIONS.TOOLTIP_SHOWN,
      id: 'refresh',
      screen: 'dummy',
    })).toEqual({
      firstRun: true,
      showTooltip: {
        dummy: 'next',
        dummyNext: 'crash',
      },
      total: '---',
      loading: false,
      date: '---',
    });
  });
  test('Close last tooltip', () => {
    expect(reducer(undefined, {
      type: ACTIONS.TOOLTIP_SHOWN,
      id: 'next',
      screen: 'dummy',
    })).toEqual({
      firstRun: true,
      showTooltip: {
        dummy: 'none',
        dummyNext: 'crash',
      },
      total: '---',
      loading: false,
      date: '---',
    });
  });
  test('Reset tooltips', () => {
    expect(reducer({
      firstRun: false,
      showTooltip: {
        dummy: 'none',
        dummyNext: 'none',
      },
      total: '---',
      loading: false,
      date: '---',
    }, {
      type: ACTIONS.REVIEW_WALKTHROUGH,
    })).toEqual({
      firstRun: true,
      showTooltip: {
        dummy: 'refresh',
        dummyNext: 'crash',
      },
      total: '---',
      loading: false,
      date: '---',
    });
  });
});
