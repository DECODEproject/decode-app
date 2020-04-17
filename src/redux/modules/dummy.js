/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 * Copyright (C) 2020 - Dyne.org
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
  credentialKeygen,
  credentialRequest,
  issuerKeygen,
  publishVerifier,
  issuerSign,
  aggregateSignature,
  createProof,
  verifyProof,
  dp3t,
} from 'api/zenroom';
import { debugLog } from 'lib/utils';

const initialState = {
  total: '---',
  loading: false,
  date: '---',
  verified: '   ',
  secret: '*******',
};

export const ACTIONS = {
  REFRESH_STATS_REQUEST: 'REFRESH_STATS_REQUEST',
  REFRESH_STATS_SUCCESS: 'REFRESH_STATS_SUCCESS',
  REFRESH_STATS_FAILURE: 'REFRESH_STATS_FAILURE',
  REFRESH_DATE: 'REFRESH_DATE',
  ZENROOM_REQUEST: 'ZENROOM_REQUEST',
  ZENROOM_SUCCESS: 'ZENROOM_SUCCESS',
  ZENROOM_FAILURE: 'ZENROOM_FAILURE',
  REFRESH_SECRET: 'REFRESH_SECRET'
};

export const callDp3t = () => async (dispatch) => {
  try {
    const result = await zenroom.execute(dp3t(), '', '');
    const secret = JSON.parse(result)['secret_day_key'][0]
    dispatch({
      type: ACTIONS.REFRESH_SECRET,
      secret: secret
    })
  } catch (e) {
    dispatch({
      type: ACTIONS.ZENROOM_FAILURE,
      error: e.message,
    });
  }
}

export const callZenroom = () => async (dispatch) => {
  dispatch({
    type: ACTIONS.ZENROOM_REQUEST,
  });
  try {
    const id = 'Alice';
    const issuerId = 'Madhatter';

    const keypair = await zenroom.execute(credentialKeygen(id), '', '');
    debugLog('Keypair: ', keypair);
    const request = await zenroom.execute(credentialRequest(id), '', keypair);
    debugLog('Request: ', request);
    const issuerKeypair = await zenroom.execute(issuerKeygen(issuerId), '', '');
    debugLog('Issuer keypair: ', issuerKeypair);
    const verifier = await zenroom.execute(publishVerifier(issuerId), '', issuerKeypair);
    debugLog('Verifier: ', verifier);
    const signature = await zenroom.execute(issuerSign(issuerId), request, issuerKeypair);
    debugLog('Signature: ', signature);
    const credential = await zenroom.execute(aggregateSignature(id), signature, keypair);
    debugLog('Credential: ', credential);
    const proof = await zenroom.execute(createProof(id, issuerId), verifier, credential);
    debugLog('Proof: ', proof);
    const verified = await zenroom.execute(verifyProof(issuerId), verifier, proof);
    debugLog('Verified: ', verified ? 'OK' : 'KO');

    dispatch({
      type: verified ? ACTIONS.ZENROOM_SUCCESS : ACTIONS.ZENROOM_FAILURE,
    });
  } catch (e) {
    dispatch({
      type: ACTIONS.ZENROOM_FAILURE,
      error: e.message,
    });
  }
};

export const refreshStats = () => async (dispatch) => {
  dispatch({
    type: ACTIONS.REFRESH_STATS_REQUEST,
  });
  try {
    const credentialIssuer = new CredentialIssuerClient('https://credentials.decodeproject.eu');
    const { total } = await credentialIssuer.getStats();
    dispatch({
      type: ACTIONS.REFRESH_STATS_SUCCESS,
      total,
    });
  } catch (e) {
    dispatch({
      type: ACTIONS.REFRESH_STATS_FAILURE,
      e,
    });
  }
};

export const refreshDate = () => ({
  type: ACTIONS.REFRESH_DATE,
  date: new Date(),
});

const getDummy = prop('dummy');

export const getTotal = createSelector(
  getDummy,
  prop('total'),
);

export const getDate = createSelector(
  getDummy,
  prop('date'),
);

export const getLoading = createSelector(
  getDummy,
  prop('loading'),
);

export const getVerified = createSelector(
  getDummy,
  prop('verified'),
);

export const getSecret = createSelector(
  getDummy,
  prop('secret'),
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REFRESH_STATS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ACTIONS.REFRESH_STATS_SUCCESS: {
      const { total } = action;
      return {
        ...state,
        total,
        loading: false,
      };
    }
    case ACTIONS.REFRESH_STATS_FAILURE: {
      return {
        ...state,
        total: 'XXX',
        loading: false,
      };
    }
    case ACTIONS.REFRESH_DATE: {
      const { date } = action;
      return {
        ...state,
        date,
      };
    }
    case ACTIONS.REFRESH_SECRET: {
      const { secret } = action;
      return {
        ...state,
        secret,
      };
    }
    case ACTIONS.ZENROOM_REQUEST: {
      return {
        ...state,
        loading: true,
        verified: '-_-',
      };
    }
    case ACTIONS.ZENROOM_SUCCESS: {
      return {
        ...state,
        loading: false,
        verified: 'OK',
      };
    }
    case ACTIONS.ZENROOM_FAILURE: {
      const { error } = action;
      return {
        ...state,
        loading: false,
        verified: error || 'KO',
      };
    }
    default:
      return state;
  }
};
