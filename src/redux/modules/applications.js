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
import { prop, map, merge } from 'ramda';
import { listApplications } from 'api/atlas-client';

export const initialState = {
  dddc: {
    uses: 2,
    certificates: 1,
  },
  bcnnow: {
    uses: 0,
    certificates: 0,
  },
};

const defaultStats = {
  uses: 0,
  certificates: 0,
};

const getStoreBranch = prop('applications');

const getAtlasApplications = () => listApplications();

export const getApplicationStats = createSelector(
  getStoreBranch,
  getAtlasApplications,
  (userApplications, atlasApplications) => map(
    atlasApp => merge(atlasApp, userApplications[atlasApp.name] || defaultStats),
    atlasApplications,
  ),
);

export default () => initialState;
