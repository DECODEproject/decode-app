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
import { path, prop, indexBy, assoc, includes, map, values, merge } from 'ramda';
import { toggle } from 'lib/utils';
import loginApi from 'api/login-client';
import { getApplication } from 'api/atlas-client';
import { getSharedAttributes as getSharedAttributesFromAtlas } from 'redux/modules/attributes';

export const initialState = {
  loading: false,
  loggedIn: false,
  selectedAttributes: [],
  uses: [],
  certificates: {},
  error: null,
};

export const ACTIONS = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  TOGGLE_SELECTED_ATTRIBUTE: 'TOGGLE_SELECTED_ATTRIBUTE',
  CLEANUP_STATE: 'CLEANUP_STATE',
};

export const cleanupState = () => ({
  type: ACTIONS.CLEANUP_STATE,
});

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

const getSelectedAttributes = createSelector(
  getBranch,
  prop('selectedAttributes'),
);

export const getSharedAttributes = createSelector(
  [getSharedAttributesFromAtlas('bcnnow'), getSelectedAttributes],
  (sharedAttributes, selectedAttributes) => {
    const applicationAttributes = indexBy(prop('name'), map(item => ({ name: item }), getApplication('bcnnow').sharedAttributes));
    const userAttributes = indexBy(prop('name'))(
      map(
        attr => (assoc('selected', includes(attr.name, selectedAttributes), attr)),
        sharedAttributes,
      ),
    );
    return values(merge(applicationAttributes, userAttributes));
  },
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CLEANUP_STATE: {
      return {
        ...state,
        loading: false,
        error: null,
        loggedIn: false,
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
