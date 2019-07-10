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

import { createSelector } from 'reselect';
import {
  prop, map, merge, reduce, min, max, union, length, contains, compose, filter, last,
} from 'ramda';
import moment from 'moment';
import { listApplications, listAttributes } from 'api/atlas-client';
import { upperFirst } from 'lib/utils';

export const initialState = {
  dddc: {
    uses: [
      {
        date: +moment('2019-02-11'),
        sharedData: ['gender'],
      },
      {
        date: +moment('2019-04-21'),
        sharedData: ['address'],
      },
    ],
    certificates: 1,
  },
  bcnnow: {
    uses: [],
    certificates: 0,
  },
};

const defaultStats = {
  usageCount: 0,
  numCertificates: 0,
};

const getStoreBranch = prop('applications');

const getAtlasApplications = () => listApplications();

const getAtlasAttributes = () => listAttributes();

// Convert persisted raw data into aggregated values
const reduceUsageStats = reduce(
  (acc, current) => ({
    firstUse: min(current.date, acc.firstUse),
    lastUse: max(current.date, acc.lastUse),
    sharedData: union(current.sharedData, acc.sharedData),
  }),
  {},
);

/*
 * Transform usage count, interval of time, and unit of time into frequency by that unit of time
 * by calling the appropriate moment function asYears, asMonths, asWeeks, asDays
 */
const frequencyByUnit = (count, interval, unit) => {
  const frequency = delta => Math.round(count / delta);
  const momentFunction = `as${upperFirst(unit)}s`;
  console.log('*', momentFunction, interval[momentFunction](), [frequency(interval[momentFunction]()), unit]);
  return [frequency(interval[momentFunction]()), unit];
};

/*
 * Given the usage count and the first date of use, calculate average use.
 * It calculates the average in the 4 possible units, rounded to an integer,
 * and chooses the smaller being greater than zero
 * ... or return 0 times a year which will be shown as 'less than once a year'
 */

export const calculateAverage = (firstUse, count) => {
  console.log('first use & count: ', +firstUse, count);
  const interval = moment.duration((moment() - firstUse));
  console.log('interval: ', +moment(), +interval);
  const units = ['year', 'month', 'week', 'day'];
  return compose(
    last,
    filter(n => n[0] > 0),
    map(unit => frequencyByUnit(count, interval, unit)),
  )(units) || [0, 'year'];
};

const calculateAppUsageStats = (uses) => {
  const reducedStats = reduceUsageStats(uses);
  const { firstUse, lastUse, sharedData = [] } = reducedStats;
  const count = length(uses);
  return ({
    usageCount: count,
    firstUse,
    lastUse,
    sharedData: map(({ name }) => ({
      id: name,
      shared: contains(name, sharedData),
    }))(getAtlasAttributes()),
    averageUse: calculateAverage(firstUse, count),
  });
};

const getUsageStats = createSelector(
  getStoreBranch,
  map(({ uses, certificates }) => ({
    ...calculateAppUsageStats(uses),
    numCertificates: certificates,
  })),
);

export const getApplicationStats = createSelector(
  getUsageStats,
  getAtlasApplications,
  (usageStats, atlasApplications) => map(
    atlasApp => merge(atlasApp, usageStats[atlasApp.id] || defaultStats),
    atlasApplications,
  ),
);

export default () => initialState;
