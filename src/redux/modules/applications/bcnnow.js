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
import { path, prop } from 'ramda';
import { toggle } from 'lib/utils';
import loginApi from 'api/login-client';
import { APPLICATION_ACTIONS } from './actions';

export const initialState = {
  loading: false,
  loggedIn: false,
  selectedAttributes: [],
  uses: [],
  certificates: {},
  error: null,
  steps: 2,
  step: 1,
};

export const ACTIONS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  TOGGLE_SELECTED_ATTRIBUTE: 'TOGGLE_SELECTED_ATTRIBUTE',
  CLEANUP_STATE: 'CLEANUP_STATE',
};

export const toggleSelectedAttribute = id => ({
  type: ACTIONS.TOGGLE_SELECTED_ATTRIBUTE,
  id,
});

export const login = (bcnnowUrl, sessionId, certificate, attributes) => async (dispatch) => {
  dispatch({
    type: ACTIONS.LOGIN_REQUEST,
  });
  try {
    const loginResponse = await loginApi(
      bcnnowUrl,
      sessionId,
      certificate,
      attributes,
    );
    dispatch({
      type: ACTIONS.LOGIN_SUCCESS,
      loginResponse,
    });
  } catch (error) {
    dispatch({
      type: ACTIONS.LOGIN_FAILURE,
      error: error.message,
    });
  }
};

const getBranch = path(['applications', 'bcnnow']);

export const getLoading = createSelector(
  getBranch,
  prop('loading'),
);

export const getLoggedIn = createSelector(
  getBranch,
  prop('loggedIn'),
);

export const getError = createSelector(
  getBranch,
  prop('error'),
);

export default (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_ACTIONS.INIT_APPLICATION: {
      if (action.id !== 'bcnnow') return state;
      return {
        ...state,
        loading: false,
        error: null,
        loggedIn: false,
        step: 1,
      };
    }
    case ACTIONS.LOGIN_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null,
        loggedIn: false,
      };
    }
    case ACTIONS.LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
        loggedIn: true,
        step: 2,
      };
    }
    case ACTIONS.LOGIN_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case ACTIONS.TOGGLE_SELECTED_ATTRIBUTE: {
      const { selectedAttributes } = state;
      return {
        ...state,
        selectedAttributes: toggle(action.id, selectedAttributes),
      };
    }
    default:
      return state;
  }
};
