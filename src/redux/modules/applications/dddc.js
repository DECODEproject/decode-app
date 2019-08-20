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
import moment from 'moment';
import { path, prop } from 'ramda';
import { fetchPetition as fetchPetitionApi } from 'api/dddc-client';

const emptyPetition = {
  description: '<p>',
  verificationCodes: {},
};

export const initialState = {
  loading: false,
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
  certificates: 1,
  verification: {},
  petition: emptyPetition,
};

export const ACTIONS = {
  FETCH_PETITION_REQUEST: 'FETCH_PETITION_REQUEST',
  FETCH_PETITION_SUCCESS: 'FETCH_PETITION_SUCCESS',
  FETCH_PETITION_FAILURE: 'FETCH_PETITION_FAILURE',
  UPDATE_VERIFICATION_CODE: 'UPDATE_VERIFICATION_CODE',
};

export const fetchPetition = (url, id) => async (dispatch) => {
  dispatch({
    type: ACTIONS.FETCH_PETITION_REQUEST,
    url,
    id,
  });
  try {
    const petition = await fetchPetitionApi(url, id);
    dispatch({
      type: ACTIONS.FETCH_PETITION_SUCCESS,
      petition,
    });
  } catch (e) {
    dispatch({
      type: ACTIONS.FETCH_PETITION_FAILURE,
      error: e.message,
    });
  }
};

export const updateVerificationCode = (id, value) => ({
  type: ACTIONS.UPDATE_VERIFICATION_CODE,
  id,
  value,
});

const getBranch = path(['applications', 'dddc']);

export const getPetition = createSelector(
  getBranch,
  prop('petition'),
);

export const getLoading = createSelector(
  getBranch,
  prop('loading'),
);

export const getError = createSelector(
  getBranch,
  prop('error'),
);

export const getVerification = createSelector(
  getBranch,
  prop('verification'),
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_PETITION_REQUEST: {
      return {
        ...state,
        loading: true,
        petition: emptyPetition,
        verification: {},
        error: null,
      };
    }
    case ACTIONS.FETCH_PETITION_SUCCESS: {
      return {
        ...state,
        loading: false,
        petition: action.petition,
      };
    }
    case ACTIONS.FETCH_PETITION_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case ACTIONS.UPDATE_VERIFICATION_CODE: {
      const { verification } = state;
      return {
        ...state,
        verification: {
          ...verification,
          [action.id]: action.value,
        },
      };
    }
    default:
      return state;
  }
};
