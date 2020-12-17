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
import { prop } from 'ramda';
import CredentialIssuerClient from 'api/credential-issuer-client';
import zenroom from 'api/zenroom-client';
import {
  keypairGen

} from 'api/zenroom/webinar';
import { debugLog } from 'lib/utils';

const initialState = {
  result: 'keypair not executed',
};

export const ACTIONS = {
  ZENROOM_EXECUTION: 'ZENROOM_EXECUTION',
};

export const callZenroom = () => async (dispatch) => {
  let result;
  try {
    result = await zenroom.execute(keypairGen(), '', '');
  } catch (e) {
    debugLog('Something went wrong in webinar zenroom.')
  }
  dispatch({
    type: ACTIONS.ZENROOM_EXECUTION,
    result
  });
}

const getWebinar = prop('webinar');

export const getResult = createSelector(
    getWebinar,
    prop('result'),
);



export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ZENROOM_EXECUTION: {
      const { result } = action;
      return {
        ...state,
        result
      };
    }
    default:
      return state;
  }
};
