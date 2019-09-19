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
import { path, prop, append, isNil } from 'ramda';
import uuid from 'uuid/v4';
import { toggle, debugLog } from 'lib/utils';
import isJson from 'lib/is-json';
import zenroom from 'api/zenroom-client';
import {
  hashing,
  credentialKeygen,
  credentialRequest,
  aggregateSignature,
  createProof,
  signPetition,
} from 'api/zenroom';
import { fetchPetition as fetchPetitionApi } from 'api/dddc-client';
import CredentialIssuerClient from 'api/credential-issuer-client';
import PetitionsClient from 'api/petitions-client';
import { APPLICATION_ACTIONS } from './actions';

const emptyPetition = {
  title: '',
  description: '<p>',
  verificationCodes: [],
};

export const initialState = {
  loading: false,
  signed: false,
  selectedAttributes: [],
  uses: [],
  certificates: {},
  verification: {},
  petition: emptyPetition,
  steps: 3,
  step: 1,
};

export const ACTIONS = {
  FETCH_PETITION_REQUEST: 'FETCH_PETITION_REQUEST',
  FETCH_PETITION_SUCCESS: 'FETCH_PETITION_SUCCESS',
  FETCH_PETITION_FAILURE: 'FETCH_PETITION_FAILURE',
  UPDATE_VERIFICATION_CODE: 'UPDATE_VERIFICATION_CODE',
  ISSUE_CREDENTIAL_REQUEST: 'ISSUE_CREDENTIAL_REQUEST',
  ISSUE_CREDENTIAL_SUCCESS: 'ISSUE_CREDENTIAL_SUCCESS',
  ISSUE_CREDENTIAL_FAILURE: 'ISSUE_CREDENTIAL_FAILURE',
  SIGN_REQUEST: 'SIGN_REQUEST',
  SIGN_SUCCESS: 'SIGN_SUCCESS',
  SIGN_FAILURE: 'SIGN_FAILURE',
  TOGGLE_SELECTED_ATTRIBUTE: 'TOGGLE_SELECTED_ATTRIBUTE',
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

export const toggleSelectedAttribute = id => ({
  type: ACTIONS.TOGGLE_SELECTED_ATTRIBUTE,
  id,
});

export const callCredentialIssuer = (
  data,
  optionalData,
  { credentialIssuerUrl: url, attributeId, credentialName, id: petitionId },
) => async (dispatch) => {
  dispatch({
    type: ACTIONS.ISSUE_CREDENTIAL_REQUEST,
  });
  debugLog('callCredentialIssuer: ', data, optionalData, url, attributeId);
  const hashedData = { ...data };
  // eslint-disable-next-line no-await-in-loop,no-restricted-syntax,guard-for-in
  for (const k in hashedData) hashedData[k] = await zenroom.execute(hashing, data[k], '');
  debugLog('hashedData: ', hashedData);
  const hashedOptionalData = { ...optionalData };
  // eslint-disable-next-line no-await-in-loop,no-restricted-syntax,guard-for-in
  for (const k in hashedOptionalData) hashedOptionalData[k] = await zenroom.execute(hashing, optionalData[k], '');
  debugLog('hashedOptionalData: ', hashedOptionalData);
  const credentialIssuer = new CredentialIssuerClient(url);

  try {
    // CONTRACT 01
    const uniqueId = uuid();
    debugLog('Going to execute credentialKeygen: ', credentialKeygen(uniqueId));
    const keypair = await zenroom.execute(credentialKeygen(uniqueId), '', '');
    debugLog('Response from credentialKeygen (keypair): ', keypair);
    if (!isJson(keypair)) throw Error('Invalid response from contract 01');

    // CONTRACT 02
    debugLog('Going to execute credentialRequest: ', credentialRequest(uniqueId));
    debugLog('Keys: ', keypair);
    const blindSignatureReq = await zenroom.execute(credentialRequest(uniqueId), '', keypair);
    debugLog('Response from credentialRequest (blindSignatureReq): ', blindSignatureReq);
    if (!isJson(blindSignatureReq)) throw Error('Invalid response from contract 02');


    // CALLS TO CREDENTIAL ISSUER
    const issuerId = await credentialIssuer.getIssuerId();
    debugLog('Credential Issuer id: ', issuerId);

    const issuerVerifyKeypair = await credentialIssuer.getIssuerVerifier(attributeId);
    debugLog('Issuer verify keypair (contract 04): ', issuerVerifyKeypair);

    const issuerSignedCredential = await credentialIssuer.issueCredential(
      attributeId,
      JSON.parse(blindSignatureReq),
      hashedData,
      hashedOptionalData,
    );
    debugLog('Issuer signed credential (contract 05): ', issuerSignedCredential);

    // CONTRACT 06
    const c06 = aggregateSignature(uniqueId, issuerId);
    debugLog('Going to execute aggregateSignature: ', c06);
    debugLog('Keys: ', keypair);
    debugLog('Data: ', JSON.stringify(issuerSignedCredential));
    const credential = await zenroom.execute(
      c06,
      JSON.stringify(issuerSignedCredential),
      keypair,
    );
    debugLog('Response from aggregateSignature', credential);

    // CONTRACT 07
    const c07 = createProof(uniqueId, issuerId);
    debugLog('Going to execute createProof: ', c07);
    debugLog('Keys: ', credential);
    debugLog('Data: ', JSON.stringify(issuerVerifyKeypair));
    const blindProofCredential = await zenroom.execute(
      c07,
      JSON.stringify(issuerVerifyKeypair),
      credential,
    );
    debugLog('Response from createProof (blindProofCredential):', blindProofCredential);

    dispatch({
      type: ACTIONS.ISSUE_CREDENTIAL_SUCCESS,
      credentialName,
      petitionId,
      attributeId,
      uniqueId,
      issuerId,
      issuerVerifyKeypair,
      credential,
      blindProofCredential,
      credentialIssuerUrl: url,
    });
  } catch (error) {
    debugLog('Error calling credential issuer: ', JSON.stringify(error));
    dispatch({
      type: ACTIONS.ISSUE_CREDENTIAL_FAILURE,
      error: error.message,
    });
  }
};

export const callSignPetition = (
  { petitionsUrl },
  { uniqueId, issuerId, attributeId, credential, issuerVerifyKeypair },
) => async (dispatch) => {
  dispatch({
    type: ACTIONS.SIGN_REQUEST,
  });
  try {
    const c11 = signPetition(uniqueId, issuerId, attributeId);
    debugLog('Going to execute signPetition: ', c11);
    debugLog('Keys: ', credential);
    debugLog('Data: ', JSON.stringify(issuerVerifyKeypair));
    const petitionSignature = await zenroom.execute(
      c11,
      JSON.stringify(issuerVerifyKeypair),
      credential,
    );
    debugLog('Response from signPetition (petitionSignature): ', petitionSignature);
    if (!isJson(petitionSignature)) throw Error('Unexpected response from contract 11');

    // CALL TO PETITIONS SERVICE
    const petitionsClient = new PetitionsClient(petitionsUrl);
    await petitionsClient.sign(attributeId, JSON.parse(petitionSignature));

    dispatch({
      type: ACTIONS.SIGN_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: ACTIONS.SIGN_FAILURE,
      error: error.message,
    });
  }
};

const getBranch = path(['applications', 'dddc']);

export const getPetition = createSelector(
  getBranch,
  prop('petition'),
);

export const getLoading = createSelector(
  getBranch,
  prop('loading'),
);

export const getSigned = createSelector(
  getBranch,
  prop('signed'),
);

export const getError = createSelector(
  getBranch,
  prop('error'),
);

export const getVerification = createSelector(
  getBranch,
  prop('verification'),
);

export const getCertificates = createSelector(
  getBranch,
  prop('certificates'),
);

export default (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_ACTIONS.INIT_APPLICATION: {
      if (action.id !== 'dddc') return state;
      return {
        ...state,
        step: 1,
        signed: false,
        error: null,
      };
    }
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
      const { certificates } = state;
      return {
        ...state,
        loading: false,
        petition: action.petition,
        step: isNil(certificates[action.petition.id]) ? 1 : 2,
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
    case ACTIONS.TOGGLE_SELECTED_ATTRIBUTE: {
      const { selectedAttributes } = state;
      return {
        ...state,
        selectedAttributes: toggle(action.id, selectedAttributes),
      };
    }
    case ACTIONS.ISSUE_CREDENTIAL_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case ACTIONS.ISSUE_CREDENTIAL_SUCCESS: {
      const {
        petitionId,
        uniqueId,
        attributeId,
        issuerId,
        issuerVerifyKeypair,
        credential,
        blindProofCredential,
        credentialName,
        credentialIssuerUrl,
      } = action;
      const { certificates } = state;
      return {
        ...state,
        loading: false,
        step: 2,
        certificates: {
          ...certificates,
          [petitionId]: {
            petitionId,
            uniqueId,
            issuerId,
            issuerVerifyKeypair,
            credential,
            blindProofCredential,
            credentialName,
            attributeId,
            credentialIssuerUrl,
          },
        },
      };
    }
    case ACTIONS.ISSUE_CREDENTIAL_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case ACTIONS.SIGN_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null,
        signed: false,
      };
    }
    case ACTIONS.SIGN_SUCCESS: {
      const { uses, selectedAttributes } = state;
      return {
        ...state,
        loading: false,
        signed: true,
        step: 3,
        uses: append({
          date: +moment(),
          sharedData: selectedAttributes,
        },
        uses),
      };
    }
    case ACTIONS.SIGN_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
};
