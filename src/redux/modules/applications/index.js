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

import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import {
  prop,
  map,
  merge,
  reduce,
  min,
  max,
  union,
  length,
  contains,
  compose,
  filter,
  last,
  values,
  mapObjIndexed,
  keys,
  pluck,
  mergeAll,
  indexBy,
  assoc,
  includes,
  sort,
  descend,
  has,
  pick,
} from 'ramda';
import moment from 'moment';
import { getSharedAttributes as getSharedAttributesFromAtlas, addAtlasInfo, addBaseAttributeInfo } from 'redux/modules/attributes';
import { listApplications, getApplication } from 'api/atlas-client';
import { upperFirst } from 'lib/utils';
import dddc, { initialState as dddcInitialState } from './dddc';
import bcnnow, { initialState as bcnnowInitialState } from './bcnnow';
import example, { initialState as exampleInitialState } from './example';
import { APPLICATION_ACTIONS } from './actions';

const defaultStats = {
  usageCount: 0,
  numCertificates: 0,
};

export const initApplication = id => ({
  type: APPLICATION_ACTIONS.INIT_APPLICATION,
  id,
});

const getStoreBranch = prop('applications');

const atlasApplications = listApplications();

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
  return [frequency(interval[momentFunction]()), unit];
};

/*
 * Given the usage count and the first date of use, calculate average use.
 * It calculates the average in the 4 possible units, rounded to an integer,
 * and chooses the smaller being greater than zero
 * ... or return 0 times a year which will be shown as 'less than once a year'
 */

export const calculateAverage = (firstUse, count) => {
  let interval = moment.duration((moment() - firstUse));
  if (interval.asDays() < 1) interval = moment.duration('P1D');
  const units = ['year', 'month', 'week', 'day'];
  return compose(
    last,
    filter(n => n[0] > 0),
    map(unit => frequencyByUnit(count, interval, unit)),
  )(units) || [0, 'year'];
};

const calculateAppUsageStats = (id, uses) => {
  const reducedStats = reduceUsageStats(uses);
  const { firstUse, lastUse, sharedData = [] } = reducedStats;
  const count = length(uses);
  const { sharedAttributes: applicationSharedAttributes = [] } = atlasApplications[id] || {};
  return ({
    usageCount: count,
    firstUse,
    lastUse,
    sharedData: map(name => ({
      id: name,
      shared: contains(name, sharedData),
    }))(applicationSharedAttributes),
    averageUse: calculateAverage(firstUse, count),
  });
};

const getUsageStats = createSelector(
  getStoreBranch,
  mapObjIndexed(({ uses, certificates }, id) => ({
    id,
    ...calculateAppUsageStats(id, uses),
    numCertificates: length(keys(certificates)),
  })),
);

export const getApplicationStats = createSelector(
  getUsageStats,
  usageStats => map(
    ({ id, sharedAttributes, ...rest }) => merge({ id, ...rest }, usageStats[id] || defaultStats),
    values(atlasApplications),
  ),
);

export const getAllCertificates = createSelector(
  getStoreBranch,
  compose(
    mergeAll,
    values,
    pluck('certificates'),
  ),
);

const getSelectedAttributes = applicationId => createSelector(
  getStoreBranch,
  compose(
    prop('selectedAttributes'),
    prop(applicationId),
  ),
);

export const getSharedAttributes = applicationId => createSelector(
  [getSharedAttributesFromAtlas(applicationId), getSelectedAttributes(applicationId)],
  (sharedAttributes, selectedAttributes) => {
    const applicationAttributes = compose(
      indexBy(prop('name')),
      map(addBaseAttributeInfo),
      map(item => (addAtlasInfo({ name: item }))),
    )(getApplication(applicationId).sharedAttributes);
    const userAttributes = indexBy(prop('name'))(
      map(
        attr => (assoc('selected', includes(attr.name, selectedAttributes), attr)),
        sharedAttributes,
      ),
    );
    return compose(
      sort(descend(has('selected'))),
      values,
      merge(applicationAttributes),
    )(userAttributes);
  },
);

export const getProgress = applicationId => createSelector(
  getStoreBranch,
  compose(
    pick(['step', 'steps']),
    prop(applicationId),
  ),
);

export const initialApplicationState = {
  dddc: dddcInitialState,
  bcnnow: bcnnowInitialState,
  example: exampleInitialState,
};

export default combineReducers({
  dddc,
  bcnnow,
  example,
});
