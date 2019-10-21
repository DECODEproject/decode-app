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

import axios from 'axios';
import { mapObjIndexed, values } from 'ramda';
import { debugLog } from 'lib/utils';

const login = async (callback, sessionId, credential, attributes, fail = false) => {
  debugLog('Callback: ', callback);
  debugLog('Session id: ', sessionId);
  debugLog('Credential: ', credential);
  debugLog('Attributes: ', attributes);
  const { blindProofCredential, attributeId, credentialIssuerUrl } = credential;
  const { credential_proof: proof } = JSON.parse(blindProofCredential);
  const data = {
    sessionId,
    credential: {
      authorizable_attribute_id: attributeId,
      value: { proof },
      credential_issuer_endpoint_address: credentialIssuerUrl,
    },
    optionalAttributes: values(mapObjIndexed((value, key) => ({
      attribute_id: key,
      value,
    }), attributes)),
  };
  debugLog('JSON data: ', data);
  debugLog('JSON data as string: ', JSON.stringify(data));
  try {
    const response = await axios.post(callback, data);
    const { data: responseData } = response;
    debugLog('Response from login: ', responseData);
    return response;
  } catch (error) {
    const { response: { status, data: { message } } } = error;
    debugLog('Error from login: ', status, message);
    if (fail) {
      const failError = { ...error, status: 408, message: 'timeout' };
      throw failError;
    }
    throw error;
  }
};

export default login;
