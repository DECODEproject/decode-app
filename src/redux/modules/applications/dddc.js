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
import { path, prop, append, map, assoc, includes, indexBy, merge, values } from 'ramda';
import uuid from 'uuid/v4';
import { getSharedAttributes as getSharedAttributesFromAtlas } from 'redux/modules/attributes';
import { toggle } from 'lib/utils';
import isJson from 'lib/is-json';
import { getApplication } from 'api/atlas-client';
import zenroom from 'api/zenroom-client';
import contract01 from 'api/zenroom/01-CITIZEN-credential-keygen.zencode';
import contract02 from 'api/zenroom/02-CITIZEN-credential-request.zencode';
import contract06 from 'api/zenroom/06-CITIZEN-aggregate-credential-signature.zencode';
import contract07 from 'api/zenroom/07-CITIZEN-prove-credential.zencode';
import contract11 from 'api/zenroom/11-CITIZEN-sign-petition.zencode';
import contract50 from 'api/zenroom/50-MISC-hashing.zencode';
import { fetchPetition as fetchPetitionApi } from 'api/dddc-client';
import CredentialIssuerClient from 'api/credential-issuer-client';
import PetitionsClient from 'api/petitions-client';

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
  console.log('callCredentialIssuer: ', data, optionalData, url, attributeId);
  const hashedData = { ...data };
  // eslint-disable-next-line no-await-in-loop,no-restricted-syntax,guard-for-in
  for (const k in hashedData) hashedData[k] = await zenroom.execute(contract50, data[k], '');
  console.log('hashedData: ', hashedData);
  const hashedOptionalData = { ...optionalData };
  // eslint-disable-next-line no-await-in-loop,no-restricted-syntax,guard-for-in
  for (const k in hashedOptionalData) hashedOptionalData[k] = await zenroom.execute(contract50, optionalData[k], '');
  console.log('hashedOptionalData: ', hashedOptionalData);
  const credentialIssuer = new CredentialIssuerClient(url);

  try {
    // CONTRACT 01
    const uniqueId = uuid();
    console.log('Going to execute contract01: ', contract01(uniqueId));
    const keypair = await zenroom.execute(contract01(uniqueId), '', '');
    console.log('Response from contract01 (keypair): ', keypair);
    if (!isJson(keypair)) throw Error('Invalid response from contract 01');

    // CONTRACT 02
    console.log('Going to execute contract02: ', contract02(uniqueId));
    console.log('Keys: ', keypair);
    const blindSignatureReq = await zenroom.execute(contract02(uniqueId), '', keypair);
    console.log('Response from contract02 (blindSignatureReq): ', blindSignatureReq);
    if (!isJson(blindSignatureReq)) throw Error('Invalid response from contract 02');


    // CALLS TO CREDENTIAL ISSUER
    const issuerId = await credentialIssuer.getIssuerId();
    console.log('Credential Issuer id: ', issuerId);

    const issuerVerifyKeypair = await credentialIssuer.getIssuerVerifier(attributeId);
    console.log('Issuer verify keypair (contract 04): ', issuerVerifyKeypair);

    const issuerSignedCredential = await credentialIssuer.issueCredential(
      attributeId,
      JSON.parse(blindSignatureReq),
      hashedData,
      hashedOptionalData,
    );
    console.log('Issuer signed credential (contract 05): ', issuerSignedCredential);

    // CONTRACT 06
    const c06 = contract06(uniqueId, issuerId);
    console.log('Going to execute contract 06: ', c06);
    console.log('Keys: ', keypair);
    console.log('Data: ', JSON.stringify(issuerSignedCredential));
    const credential = await zenroom.execute(
      c06,
      JSON.stringify(issuerSignedCredential),
      keypair,
    );
    console.log('Response from contract06', credential);

    // CONTRACT 07
    const c07 = contract07(uniqueId, issuerId);
    console.log('Going to execute contract 07: ', c07);
    console.log('Keys: ', credential);
    console.log('Data: ', JSON.stringify(issuerVerifyKeypair));
    const blindProofCredential = await zenroom.execute(
      c07,
      JSON.stringify(issuerVerifyKeypair),
      credential,
    );
    console.log('Response from contract07 (blindProofCredential):', blindProofCredential);

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
    });
  } catch (error) {
    console.log('Error calling credential issuer: ', JSON.stringify(error));
    dispatch({
      type: ACTIONS.ISSUE_CREDENTIAL_FAILURE,
      error: error.message,
    });
  }
};

export const signPetition = (
  { petitionsUrl },
  { uniqueId, issuerId, attributeId, credential, issuerVerifyKeypair },
) => async (dispatch) => {
  dispatch({
    type: ACTIONS.SIGN_REQUEST,
  });
  try {
    const c11 = contract11(uniqueId, issuerId, attributeId);
    console.log('Going to execute contract11: ', c11);
    console.log('Keys: ', credential);
    console.log('Data: ', JSON.stringify(issuerVerifyKeypair));
    const petitionSignature = await zenroom.execute(
      c11,
      JSON.stringify(issuerVerifyKeypair),
      credential,
    );
    console.log('Response from contract11 (petitionSignature): ', petitionSignature);
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

const getSelectedAttributes = createSelector(
  getBranch,
  prop('selectedAttributes'),
);

export const getSharedAttributes = createSelector(
  [getSharedAttributesFromAtlas('dddc'), getSelectedAttributes],
  (sharedAttributes, selectedAttributes) => {
    const applicationAttributes = indexBy(prop('name'), map(item => ({ name: item }), getApplication('dddc').sharedAttributes));
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
      } = action;
      const { certificates } = state;
      return {
        ...state,
        loading: false,
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
