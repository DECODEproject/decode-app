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
  prop, map, merge, reduce, min, max, union, length, contains,
} from 'ramda';
import moment from 'moment';
import { listApplications, listAttributes } from 'api/atlas-client';

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

const reduceUsageStats = reduce(
  (acc, current) => ({
    firstUse: min(current.date, acc.firstUse),
    lastUse: max(current.date, acc.lastUse),
    allAttributes: union(current.sharedData, acc.allAttributes),
  }),
  {},
);

const calculateAppUsageStats = (uses) => {
  const reducedStats = reduceUsageStats(uses);
  const { firstUse, lastUse, allAttributes = [] } = reducedStats;
  return ({
    usageCount: length(uses),
    firstUse,
    lastUse,
    sharedData: map(({ name }) => ({
      id: name,
      shared: contains(name, allAttributes),
    }))(getAtlasAttributes()),
    averageUse: firstUse
      ? Math.round(moment.duration((moment() - firstUse) / length(uses)).asWeeks())
      : undefined,
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
